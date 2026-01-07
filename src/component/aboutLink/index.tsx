import { aboutUsLink } from "constant"
const AboutLink = () => {
    return (
        <div className="data-sources mt-lg-3 mt-2 ">
            <a
                target="_blank"
                rel="noreferrer"
                href={aboutUsLink}
                className="d-flex align-items-center fw-medium"
            >
                <span className="glec-txt me-1">GLEC</span>See data sources
                and methodologies
            </a>
        </div>
    )
}

export default AboutLink