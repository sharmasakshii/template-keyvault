import { Response } from "express";
import { generateResponse } from "../../services/response";
import HttpStatusMessage from "../../constant/responseConstant";
import { MyUserRequest } from "../../interfaces/commonInterface";
import sequelize, { Sequelize, Op } from "sequelize";

class OnBoardController {
    // Private property for the database connection (Sequelize instance)
    private readonly connection: Sequelize;

    // Constructor to initialize the database connection for each instance
    constructor(connectionData: Sequelize) {
        this.connection = connectionData; // Assign the passed Sequelize instance to the private property
    }

    /**
    * @description API to delete role data.
    * @param {Object} request - The HTTP request object.
    * @param {Object} context - The invocation context.
    * @returns {Promise<HttpResponseInit>} The HTTP response initialization object.
    */
    async onBoardingQuestionList(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        let authenticate: any = this.connection;

        try {
            // Extract container name and other parameters from the request
            const { scope_id } = request.body;
            const company_id = authenticate?.userData?.companies[0]?.UserCompany?.company_id

            const is_onboarded = await authenticate["main"].models.CompanyOnboardingStatus.findOne({
                where: { company_id: company_id, scope_id: scope_id }
            })

            if (is_onboarded) {
                return generateResponse(res, 200, true, "Onboarded process is already completed", [])
            }
            const checkAdmin = authenticate?.userData?.permissionsData[0]?.child?.filter((ele: any) => {
                if (ele.isChecked) {
                    return true
                }
            })

            if (checkAdmin?.length == 0) {
                return generateResponse(res, 400, false, "Onboarding question only shown for admin")
            }
            const onboardingQuestion = await authenticate["main"].query(`
        EXEC greensight_master.getOnboardingStepsQuestions  @scope_id = :scope_id , @company_id=:company_id`, {
                replacements: {
                    scope_id: scope_id,
                    company_id: company_id
                },
                type: sequelize.QueryTypes.SELECT,
            });

            if (onboardingQuestion?.length == 0) {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
            }
            return generateResponse(res, 200, true, "Onboarding question list", onboardingQuestion)

        } catch (error) {
            console.log(error, "error ");
            // Handle errors and return a 500 response in case of an error.
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    /**
* @description API to delete role data.
* @param {Object} request - The HTTP request object.
* @param {Object} context - The invocation context.
* @returns {Promise<HttpResponseInit>} The HTTP response initialization object.
*/

    async addUpdateAnswer(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        const authenticate: any = this.connection;
        try {
            const { scope_id, step_id, question } = request.body;
            const company_id = authenticate?.userData?.companies[0]?.UserCompany?.company_id;

            // Check if onboarding is already completed
            const is_onboarded = await this.checkOnboardingStatus(authenticate, company_id, scope_id);
            if (is_onboarded) {
                return generateResponse(res, 400, false, "Onboarded process is already completed", []);
            }

            // Check admin permissions
            const hasAdminPermission = this.checkAdminPermissions(authenticate);
            if (!hasAdminPermission) {
                return generateResponse(
                    res,
                    400,
                    false,
                    "Scope onboarding is not yet complete. You’ll be able to access Scope dashboard once the admin finalizes the onboarding process."
                );
            }

            // Fetch onboarding questions
            const onboardingQuestion = await this.fetchOnboardingQuestions(authenticate, scope_id, step_id, company_id);
            const stepQuestions = JSON.parse(onboardingQuestion[0]?.questions || "[]");

            // Validate answers
            let payloadArrQue: any[] = [];
            try {
                const { answeredQuestionsMap } = this.validateAnswers(stepQuestions, question, onboardingQuestion[0]?.is_completed, payloadArrQue, scope_id, company_id);

                // Update answers
                await this.updateAnswers(authenticate, answeredQuestionsMap);

                // Save new answers
                await authenticate["main"].models.ScopeOnboardingAnswers.bulkCreate(payloadArrQue);

                // Handle step completion
                if (!onboardingQuestion[0]?.is_completed) {
                    await this.handleStepCompletion(authenticate, company_id, scope_id, step_id);
                    return generateResponse(res, 200, true, "Completed step successfully");
                }

                return generateResponse(res, 200, true, "Update the question successfully");
            } catch (error: any) {
                console.error("Validation error:", error);
                return generateResponse(res, 400, false, error?.message);
            }
        } catch (error) {
            console.error("Internal error:", error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    private async checkOnboardingStatus(authenticate: any, company_id: number, scope_id: number): Promise<boolean> {
        const isOnboarded = await authenticate["main"].models.CompanyOnboardingStatus.findOne({
            where: { company_id, scope_id },
        });
        return !!isOnboarded;
    }

    private checkAdminPermissions(authenticate: any): boolean {
        const adminPermissions = authenticate?.userData?.permissionsData[0]?.child?.filter((ele: any) => ele.isChecked);
        return adminPermissions?.length > 0;
    }

    private async fetchOnboardingQuestions(authenticate: any, scope_id: number, step_id: number, company_id: number): Promise<any[]> {
        return await authenticate["main"].query(
            `EXEC greensight_master.getOnboardingStepsQuestions @step_id=:step_id, @scope_id=:scope_id, @company_id=:company_id`,
            {
                replacements: { scope_id, step_id, company_id },
                type: sequelize.QueryTypes.SELECT,
            }
        );
    }

    private validateAnswers(
        questions: any[],
        payload: any[],
        is_step_complete: boolean,
        payloadArrQue: any[],
        scope_id: number,
        company_id: number
    ): { answeredQuestionsMap: Record<string, any> } {
        const answeredQuestionsMap = Object.fromEntries(payload.map(({ question_id, option_id }: any) => [question_id, option_id]));

        if (payload.length > questions.length) {
            throw new Error(`You cannot answer more than ${questions.length} questions for this step.`);
        }

        if (!is_step_complete) {
            const requiredQuestions = questions.filter((q: any) => q.is_required).map((q: any) => q.question_id);
            const answeredRequiredQuestions = requiredQuestions.filter((id: any) => answeredQuestionsMap[id]);
            if (answeredRequiredQuestions.length !== requiredQuestions.length) {
                throw new Error(`Please provide inputs on required questions.`);
            }
        }

        const validQuestionIds = new Set(questions.map((q: any) => q.question_id));
        questions.forEach((question: any) => {
            const answers = Array.isArray(answeredQuestionsMap[question.question_id])
                ? answeredQuestionsMap[question.question_id]
                : [answeredQuestionsMap[question.question_id]];

            answers.forEach((option_id: any) => {
                if (!validQuestionIds.has(Number(question.question_id))) {
                    throw new Error(`Invalid question ID: "${question.question_id}" provided.`);
                }

                const option = question.options.find((opt: any) => opt.option_id == option_id?.id);
                if (!option) {
                    throw new Error(`Invalid answer for question: "${question.question}".`);
                }

                const payload = {
                    scope_id,
                    scope_question_id: question.question_id,
                    option_id: option_id?.id,
                    company_id,
                    answer_text: question.question_type_id == '1232' ? option_id?.text : option?.value,
                };
                payloadArrQue.push(payload);
            });
        });

        return { answeredQuestionsMap };
    }

    private async updateAnswers(authenticate: any, answeredQuestionsMap: Record<string, any>): Promise<void> {
        for (const question_id of Object.keys(answeredQuestionsMap)) {
            const existingAnswers = await authenticate["main"].models.ScopeOnboardingAnswers.findAll({
                where: { scope_question_id: question_id },
            });

            for (const answer of existingAnswers) {
                await authenticate["main"].models.ScopeOnboardingAnswers.destroy({ where: { id: answer?.dataValues?.id } });
            }
        }
    }

    private async handleStepCompletion(authenticate: any, company_id: number, scope_id: number, step_id: number): Promise<void> {
        const fetchStepsCount = await authenticate["main"].models.OnboardingSteps.findAll({ where: { scope_id } });
        const completeCount = await authenticate["main"].models.UserScopeStatus.findAll({ where: { company_id, scope_id } });

        await authenticate["main"].models.UserScopeStatus.create({
            company_id,
            step_code: step_id,
            scope_id,
            is_completed: 1,
        });

        if (fetchStepsCount.length - 1 === completeCount.length) {
            await authenticate["main"].models.CompanyOnboardingStatus.create({
                is_onboarded: 1,
                scope_id,
                company_id,
            });
        }
    }

    /**
* @description API to delete role data.
* @param {Object} request - The HTTP request object.
* @param {Object} context - The invocation context.
* @returns {Promise<HttpResponseInit>} The HTTP response initialization object.
*/
    async resetOnboarding( request: MyUserRequest, res: Response ): Promise<Response> {

        try {
            let authenticate: any = this.connection;
            // Extract container name and other parameters from the request
            const {scope_id } = request.body;

            const company_id = authenticate.userData.companies[0].UserCompany.company_id

            const deleteScopeOnboardedAns = await authenticate["main"].models.ScopeOnboardingAnswers.destroy({ where: { [Op.and]: [{ company_id: company_id }, { scope_id: scope_id }] } })


            const deleteSteps = await authenticate["main"].models.UserScopeStatus.destroy({ where: { [Op.and]: [{ company_id: company_id }, { scope_id: scope_id }] } })


            const updateCompanyStatus = await authenticate["main"].models.CompanyOnboardingStatus.destroy({ where: { [Op.and]: [{ company_id: company_id }, { scope_id: scope_id }] } })

            await Promise.all([deleteScopeOnboardedAns, deleteSteps, updateCompanyStatus])

            return generateResponse(res, 200, true, "Reset onboarding ");


        } catch (error) {
            console.error(error, "check error ");
            // Handle errors and return a 500 response in case of an error.
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

}

export default OnBoardController;
