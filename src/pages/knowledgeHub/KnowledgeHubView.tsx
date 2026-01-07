import React from 'react';
import TitleComponent from "../../component/tittle";
import KnowledgeHubController from "./knowledgeHubController";
import Loader from "component/loader/Loader";
import Spinner from 'component/spinner';

/**
 * Renders the KnowledgeHubView component.
 *
 * @return {JSX.Element} The rendered KnowledgeHubView component.
 */
const KnowledgeHubView = () => {
    // Importing all states and functions from sustainable controller
    const { cmsContent, isLoadingCmsContent } = KnowledgeHubController();
    if (isLoadingCmsContent) {
        return <div data-testid="knowledge-hub-loading" className='position-relative'>
        <Spinner spinnerClass='justify-content-center spinner mt-5 pt-5' />
    </div>;
    }
    return (
        <section data-testid="knowledge-hub" className="bg-white">
            <h1>{cmsContent?.title}</h1>
            <Loader isLoading={[isLoadingCmsContent]} />
            <TitleComponent title={"Knowledge Hub"} pageHeading="Knowledge Hub" />
            {/* Render HTML content */}
            {cmsContent?.data?.content && <div dangerouslySetInnerHTML={{ __html: cmsContent?.data.content }} />}
        </section>
    );
}

export default KnowledgeHubView;
