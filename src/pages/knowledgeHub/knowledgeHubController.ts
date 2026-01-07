// Importing necessary React hooks and functions
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'store/redux.hooks';
import { getCmsContentApi } from '../../store/commonData/commonSlice';

/**
 * Custom hook for managing state and actions related to the DashboardView.
 * @returns All the states and functions for DashboardView
 */
const KnowledgeHubController = () => {

    // Selecting data from the Redux store using custom hooks
    const { cmsContent, isLoadingCmsContent } = useAppSelector((state: any) => state.commonData);

    // Dispatch and navigation functions from Redux and React Router
    const dispatch = useAppDispatch();

    // Effect to fetch graph data based on yearlyData and revenueType
    useEffect(() => {
        dispatch(getCmsContentApi({
            "page_slug": "/knowledge-hub"
        }));
    }, [dispatch]);

    useEffect(() => {
        if (cmsContent?.data?.content) {
            // 1️⃣ Execute <script> inside cmsContent
            const container = document.createElement('div');
            container.innerHTML = cmsContent.data.content;
    
            const cmsScripts = container.querySelectorAll('script');
            cmsScripts.forEach(oldScript => {
                const newScript = document.createElement('script');
    
                // Copy attributes like 'src', 'type', etc.
                Array.from(oldScript.attributes).forEach(attr => {
                    newScript.setAttribute(attr.name, attr.value);
                });
    
                newScript.innerHTML = oldScript.innerHTML;
                document.body.appendChild(newScript);
            });
    
            // 2️⃣ Add your custom script (user guide and image logic)
            const customScript = document.createElement('script');
            const baseUrl = process.env.REACT_APP_BASE_URL_ASSET;
            const blobToken = process.env.REACT_APP_BASE_URL_ASSET_TOKEN;
    
            customScript.innerHTML = `
                (function() {
                    try {
                        // Download Guide
                        let userGuideBtn = document.getElementById("userGuideBtn");
                        const userGuideLink = "${baseUrl}/UserGuide_Sustainable-Head.pdf?${blobToken}";
    
                        if (userGuideBtn) {
                            userGuideBtn.addEventListener("click", () => {
                                const link = document.createElement("a");
                                link.href = userGuideLink;
                                link.setAttribute("download", "User Guide");
                                link.setAttribute("target", "_blank");
                                link.click();
                                link.remove();
                            });
                        } else {
                            console.error("userGuideBtn not found");
                        }
    
                        // Get images from Blob
                        let images = document.querySelectorAll('.knowledgeImages');
    
                        if (images.length > 0) {
                            Array.from(images).forEach(element => {
                                let srcAtr = element.getAttribute("alt");
                                if (srcAtr) {
                                    const imageLink = "${baseUrl}/images/knowledge-images/" + srcAtr + "?${blobToken}";
                                    element.setAttribute("src", imageLink);
                                } else {
                                    console.error("Image alt attribute not found for element", element);
                                }
                            });
                        } else {
                            console.error("No images found with class 'knowledgeImages'");
                        }
                    } catch (error) {
                        console.error("An error occurred:", error);
                    }
                })();
            `;
    
            document.body.appendChild(customScript);
    
            // 3️⃣ Cleanup when component unmounts
            return () => {
                cmsScripts.forEach(() => {
                    // Clean up CMS scripts if needed - optional
                });
                document.body.removeChild(customScript);
            };
        }
    }, [cmsContent]);
    
    // Returning all states and functions to be used in DashboardView
    return {
        cmsContent,
        isLoadingCmsContent
    };
};

// Exporting the custom hook for use in other components
export default KnowledgeHubController;