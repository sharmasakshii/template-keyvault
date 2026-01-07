import ButtonComponent from 'component/forms/button'
import Heading from 'component/heading'
import TitleComponent from 'component/tittle'
import { Col, Row } from 'reactstrap'
import OnBoardController from './onBoardController'
import Loader from 'component/loader/Loader';
import InputForm from './InputForm';
import "../../../scss/scope1/_index.scss"


const getActiveClassTitle = (status: any, questionStep: any, index: number) => {
    if (status) {
        return { class: "completed", label: "Completed", btClass: "btn-deepgreen" }
    } else if (questionStep === index) {
        return { class: "inProg", label: "In Progress", btClass: "btn-deepgreen" }
    } else {
        return { class: "pending", label: "Pending", btClass: "disabled-button" }
    }
}
const OnBoardView = (props: any) => {

    const {
        questionList,
        questionsDto,
        isLoadingQuestions,
        handleNextQuestion,
        questionStep,
        handleChangeInput,
        handlePreviousQuestion
    } = OnBoardController(props)
    const { scopeId } = props
    const lastQuestion = questionList.length - 1 === questionStep
    const questionDto = lastQuestion && questionList[questionStep]?.list?.[0]?.user_answers?.[0]?.answer_text === "Yes" ? questionList[questionStep]?.list.filter((item: any) => item?.question_type !== "Checkbox") : questionList[questionStep]?.list
    return (
        <section className='scope-one-screen-outer'>
            <TitleComponent
                title={"Segmentation By Carrier"}
                pageHeading={`Scope ${scopeId} Emissions `}
            />
            <Loader isLoading={[isLoadingQuestions]} />

            <div data-testid="scope-one-screen-onboarding" className='scope-one-screen mt-2 p-3 pb-5 mx-2'>

                <Heading level="3" content={`Scope ${scopeId} Onboarding Questions`} className="font-xxl-28 font-24 fw-semibold text-center mb-4 mt-3" />
                <Heading level="4" content={questionList[questionStep]?.step_heading} className="font-xxl-24 font-20 fw-semibold text-center mb-4 mt-3" />

                <Row>
                    <Col md="3">
                        <div className='progress-tracker d-flex justify-content-center align-items-center flex-column'>
                            {questionsDto?.data?.length > 0 && questionList?.map((item: any, index: number) => (
                                <div key={item?.step_id} className='d-flex gap-2 lastbar'>
                                    <Heading level="4" className={`font-14 fw-medium prog ${getActiveClassTitle(item?.is_completed, questionStep, index).class} mb-0`} content={getActiveClassTitle(item?.is_completed, questionStep, index).label} />
                                    <div className='d-flex flex-column justify-content-center align-items-center'>
                                        <ButtonComponent text={item?.step_name} btnClass={`${getActiveClassTitle(item?.is_completed, questionStep, index).btClass}  font-14`} />
                                        <div className={`bar ${item?.is_completed ? "active" : ""}`}></div>
                                    </div>
                                </div>
                            ))}

                        </div>
                    </Col>
                    <Col md="8">
                        <div className='progress-one'>
                            <Row className='g-0'>
                                <Col lg="10 ps-0">
                                    {questionDto?.map((item: any) => (
                                        <div key={`${item?.question_id}`} className='mb-3 select-box'>
                                            <Heading level="4" className="font-xxl-16 font-14 mb-3" >{item?.question} <span className='text-danger'>{item?.is_required ? "*" : ""}</span></Heading>
                                            <InputForm dataTestId={`scope-one-${item?.question_id}`} item={item} handleChangeInput={handleChangeInput} />
                                        </div>
                                    ))}

                                </Col>
                            </Row>
                            <div className='d-flex justify-content-end pe-4 gap-2'>
                                {questionStep !== 0 &&
                                    <ButtonComponent data-testid="scope-one-screen-onboarding-back" onClick={() => handlePreviousQuestion(questionStep - 1)} text={"Back"} imagePath="/images/back.svg" btnClass='outlineBtn-deepgreen fw-medium back font-16' />}

                                <ButtonComponent data-testid="scope-one-screen-onboarding-next" disabled={isLoadingQuestions} onClick={handleNextQuestion} text={lastQuestion ? "Submit" : "Next"} imagePath="/images/back.svg" btnClass='btn-deepgreen font-16' />
                            </div>

                        </div>
                    </Col>
                </Row>
            </div>
        </section>
    )
}

export default OnBoardView