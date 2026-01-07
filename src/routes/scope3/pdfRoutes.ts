import PdfSendEmailController from "../../controller/scope3/pdfSendEmailController";
import { createRoute } from "../../utils";



 const pdfRouteConstant = [

  createRoute("post", "/send-email-pdf",PdfSendEmailController, "sendEmissionReportEmail"),
  createRoute("post", "/send-folder-email",PdfSendEmailController, "sendFolderEmail")
];

export default pdfRouteConstant;
