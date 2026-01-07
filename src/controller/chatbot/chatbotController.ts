import sequelize, { Sequelize, Op } from "sequelize"
import { MyUserRequest } from "../../interfaces/commonInterface";
import { generateResponse } from "../../services/response";
import HttpStatusMessage from "../../constant/responseConstant";
import { paginate } from "../../services/commonServices";
import axios from "axios";
const mockQuestion = require('../../../mockQuestion.json');
import { decryptDataFunction } from "../../services/encryptResponseFunction";


class ChatBotController {
    private readonly connection: Sequelize;
    constructor(connectionData: Sequelize) {
        this.connection = connectionData
    }

    async getChatHistory(req: MyUserRequest, res: Response): Promise<Response> {

        try {
            const connection: any = this.connection

            const { title_slug, page = 1, page_size = 10 } = req.body

            const getChatCount = await connection[connection.company].models.AIAgentChatHistory.count(
                {
                    where: {
                        [Op.and]: [
                            { user_id: connection.userData.id },
                            { title_slug: title_slug }
                        ]
                    },
                    include: [
                        {
                            model: connection[connection.company].models.AIAgentTitle,
                            as: "aiAgentTitle",
                            attributes: [],
                            where: {
                                is_deleted: 0
                            }
                        }
                    ],
                })

            if (!getChatCount) {
                return generateResponse(res, 500, true, HttpStatusMessage.NOT_FOUND, { chat_not_found: true });
            }

            const getChatListByTitle = await connection[connection.company].models.AIAgentChatHistory.findAll(
                {
                    attributes: ['id', 'question', 'response_type', 'response', 'date', 'data'],
                    where: {
                        [Op.and]: [
                            { user_id: connection.userData.id },
                            { title_slug: title_slug }
                        ]
                    },
                    include: [
                        {
                            model: connection[connection.company].models.AIAgentTitle,
                            as: "aiAgentTitle",
                            attributes: [],
                            where: {
                                is_deleted: 0
                            }
                        }
                    ],
                    order: [['date', 'asc']],
                    offset: (getChatCount - (page_size * page)) < 0 ? 0 : (getChatCount - (page_size * page)),
                    limit: (getChatCount - (page_size * page)) < 0 ? (page_size + (getChatCount - (page_size * page))) : page_size
                })
            const responseData = {
                list: getChatListByTitle,
                pagination: {
                    page: page,
                    page_size: page_size,
                    total_count: getChatCount
                },
            };
            return generateResponse(res, 200, true, 'List of all chat history', responseData);
        }
        catch (err) {
            console.log(err, "err")
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getChatResponse(req: MyUserRequest, res: Response): Promise<Response> {
        try {
            const connection: any = this.connection

            let { title_slug, question, question_id } = req.body
            question = decryptDataFunction(question);

            const preprocessText = (text: string): string => {
                return text
                    .toLowerCase()
                    .replace(/[?.!]/g, "")
                    .replace(/\b(is|am|are|was|were|the|a|an|to|for|of|on|at|by|in|with|does)\b/g, "")
                    .replace(/\s+/g, "")
                    .trim();
            };

            const questionMap = new Map<string, any>();

            mockQuestion.forEach((q: any) => {
                questionMap.set(preprocessText(q.question), q);
            });

            const checkQuestion = preprocessText(question);
            const answerData = questionMap.get(checkQuestion);

            if (answerData) {
                function generateTitle(question: string): string {
                    const stopWords = new Set(["what", "is", "the", "how", "to", "why", "does", "a", "an", "in", "for", "on", "at", "by", "of", "and", "or", "with"]);

                    const words = question.split(/\s+/)
                        .filter(word => !stopWords.has(word.toLowerCase()))
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1));
                    if (words.length === 0) {
                        return "General Request";
                    }
                    return words.splice(0, 4).join(" ");
                }

                const checkTitle = await connection[connection.company].models["AIAgentTitle"].findOne({
                    attributes: ["id"],
                    where: { slug: title_slug }
                })

                checkTitle ? await connection[connection.company].models["AIAgentTitle"]['update']({ updated_at: new Date() }, { where: { slug: title_slug } }) : await connection[connection.company].models["AIAgentTitle"]['create']({
                    title: generateTitle(question),
                    slug: title_slug,
                    user_id: connection['userData']['id'],
                    is_deleted: 0
                })

                await connection[connection.company].models['AIAgentChatHistory']['create']({
                    question: question,
                    response: answerData.answer,
                    response_type: answerData.type,
                    title_slug: title_slug,
                    user_id: connection['userData']['id'],
                    status: 1,
                    data: answerData?.data
                })

                const response = {
                    title_slug: title_slug,
                    question: question,
                    response: answerData.answer,
                    question_id: question_id,
                    response_type: answerData?.type,
                    data: answerData?.data
                }

                await new Promise(resolve => setTimeout(resolve, 2000));

                return generateResponse(res, 200, true, 'Single chat data', response);
            }
            else {
                const payload = {
                    "question": question,
                    question_id: question_id,
                    db_alias: connection['userData']['companies'][0].db_alias,
                    user_id: connection['userData']['id'],
                    title_slug: title_slug,
                    tenant: connection.company
                }

                const url = process.env.CHAT_BOT_URL ?? ""
                const config = {
                    method: 'post',
                    url: url,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: { ...payload }
                };
                const resp = await axios(config)

                return generateResponse(res, 200, true, 'Single chat data', resp?.data);
            }
        }
        catch (err) {
            console.log(err, "err")
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getChatList(req: MyUserRequest, res: Response): Promise<Response> {
        try {

            const companyConnections: any = this.connection;
            const company = companyConnections.company;
            const companyModels = companyConnections[company].models;

            // Extract pagination parameters from the request (default to page 1 and limit 10)
            const page: any = parseInt(req.query.page as string) || 1;
            const page_size = parseInt(req.query.page_size as string) || 10;
            let page_server = parseInt(page) - 1;
            // Fetch chat sessions with pagination
            const chats = await companyModels.AIAgentTitle.findAndCountAll(
                paginate({
                    attributes: [
                        ["id", "title_id"],
                        ["slug", "title_slug"],
                        "title",
                        "user_id",
                        ["updated_at", "date"],
                    ],
                    where: { is_deleted: 0, user_id: companyConnections.userData.id },
                    order: [["updated_at", "DESC"]],
                    raw: true,
                }, {
                    page: page_server,
                    pageSize: page_size,
                })

            );

            const responseData = {
                list: chats.rows,
                pagination: {
                    page: page,
                    page_size: page_size,
                    total_count: chats.count
                },
            };

            return generateResponse(
                res,
                200,
                true,
                'Chat list retrieved successfully.',
                responseData
            );
        } catch (error) {
            console.error(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async searchChatHistory(req: MyUserRequest, res: Response): Promise<Response> {
        try {
            const companyConnections: any = this.connection;
            const company = companyConnections.company;
            const companyModels = companyConnections[company].models;

            const { search, limit = 10 }: any = req.query;

            const safeLimit = parseInt(limit) || 10;

            const searchResults = await companyModels.AIAgentChatHistory.findAll({
                attributes: [
                    [sequelize.fn("MIN", sequelize.col("id")), "id"],
                    "question"
                ],
                where: {
                    is_deleted: 0,
                    status: 1,
                    question: { [Op.like]: `%${search}%` }
                },
                group: ["question"],
                order: [[sequelize.fn("MIN", sequelize.col("id")), "DESC"]],
                limit: safeLimit,
                raw: true
            });

            return generateResponse(
                res,
                200,
                true,
                'Search results retrieved successfully.',
                searchResults
            );
        } catch (error) {
            console.error("Error searching chat history:", error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async removeChatHistory(req: MyUserRequest, res: Response): Promise<Response> {
        try {
            const companyConnections: any = this.connection;
            const company = companyConnections.company;
            const companyModels = companyConnections[company].models;

            const { chatId } = req.body;

            if (!chatId) {
                return generateResponse(res, 400, false, "Chat ID(s) are required.");
            }
            // Update status to 0
            const updateResult = await companyModels.AIAgentChatHistory.update(
                { status: 0 },
                {
                    where: {
                        id: chatId,
                        status: 1
                    },
                }
            );

            if (updateResult[0] === 0) {
                return generateResponse(res, 200, false, "No matching chat history found or already removed.");
            }

            return generateResponse(res, 200, true, "Chat history removed successfully.");
        } catch (error) {
            console.error("Error removing chat history:", error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }
}

export default ChatBotController