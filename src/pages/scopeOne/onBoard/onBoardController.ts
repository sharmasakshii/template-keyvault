// Import necessary libraries and components
import { useEffect, useState } from "react";
import { getOnboardQuestionList, addUpdateQuestionAnswere } from "store/commonData/commonSlice";
import { useAppDispatch, useAppSelector } from "store/redux.hooks";
import { useNavigate } from "react-router-dom";
import { getBaseUrl } from "utils";

// Define the ProjectController functional component
// const scopeId = 1
const OnBoardController = (props: any) => {
    const [questionStep, setQuestionStep] = useState<any>(0);
    const [questionList, setQuestionList] = useState<any>([]);
    const { questionsDto, isLoadingQuestions } = useAppSelector((state) => state.commonData);
    const { loginDetails, userProfile } = useAppSelector((state) => state.auth);

    const dispatch = useAppDispatch();
    const navigate = useNavigate()
    const { scopeId } = props

    useEffect(() => {
        dispatch(getOnboardQuestionList({ scope_id: scopeId }));
        setQuestionList([])
    }, [dispatch, scopeId]);

    useEffect(() => {
        if (questionsDto?.data?.length > 0) {
            setQuestionList(questionsDto?.data?.map((item: any) => ({
                ...item, list: JSON.parse(item.questions)?.map((res: any) => ({
                    ...res,
                    user_answers: (res?.user_answers || [])?.length === 0 ? res?.default_answers || [] : res?.user_answers || []
                }))
            })));
            setQuestionStep(questionsDto?.data?.findIndex((res: any) => res?.is_completed === null))
        } else {
            setQuestionList([])
        }
    }, [questionsDto]);
    const handleNextQuestion = async () => {
        if (questionList.length - 1 >= questionStep) {
            let answerList: any = []
            await questionList[questionStep]?.list?.forEach((res: any) => {
                let ansDto: any = []
                res?.user_answers?.forEach((ans: any) => {
                    ansDto.push({
                        id: ans?.user_option_id,
                        text: ans?.answer_text
                    })
                })
                answerList?.push({
                    "question_id": res?.question_id,
                    "option_id": ansDto
                })
            })

            await dispatch(addUpdateQuestionAnswere({
                payload: {
                    scope_id: scopeId,
                    step_id: questionList[questionStep]?.step_code,
                    question: answerList
                },
                action: setQuestionStep,
                step: questionStep + 1,
                isFinalStep: questionList.length - 1 === questionStep,
                navigate: navigate(getBaseUrl(loginDetails?.data, `scope${scopeId}`, userProfile?.data))
            }))
            setQuestionList((prevSteps: any) =>
                prevSteps.map((step: any) => {
                    if (step.step_id === questionList[questionStep].step_id) {
                        return {
                            ...step,
                            is_completed: true,
                        };
                    }
                    return step;
                })
            );
        }
    };


    const handlePreviousQuestion = (step: number) => {
        setQuestionStep(step);
    }



    const handleChangeInput = (e: any, dto: any) => {
        let answer: any = []
        switch (dto.question_type) {
            case "Select":
                answer = [{ user_option_id: e?.value, answer_text: e.label }]
                break;
            case "Radio":
                answer = [{ user_option_id: e?.value, answer_text: e.label }]
                break;
            case "Checkbox":
                answer = dto?.user_answers || []
                if (e?.target?.checked) {
                    answer.push({ user_option_id: Number.parseInt(e?.target?.value), answer_text: e?.target?.name })
                } else {
                    answer = answer.filter((item: any) => item?.user_option_id !== Number.parseInt(e?.target?.value));
                }
                break;
            case "Text":
                answer = [{ user_option_id: e.target.name, answer_text: e.target.value }]
                break;
            default:
                break;
        }

        setQuestionList((prevSteps: any) =>
            prevSteps.map((step: any) => {
                if (step.step_id === questionList[questionStep].step_id) {
                    return {
                        ...step,
                        list: updateQuestionList(dto, step, answer)
                    };
                }
                return step;
            })
        );
    }

    const updateQuestionList = (dto: any, step: any, answer: any) => {
       return step.list.map((question: any) => {
            if (question.question_id === dto?.question_id) {
                return {
                    ...question,
                    user_answers: answer,
                };
            }
            return question;
        })
    }
    // Return the required variables and functions from the component
    return {
        questionList,
        questionsDto,
        isLoadingQuestions,
        handleNextQuestion,
        handlePreviousQuestion,
        questionStep,
        handleChangeInput

    };
};

// Export the ProjectController component
export default OnBoardController;
