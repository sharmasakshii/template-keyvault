import { Response } from "express";
import { Sequelize } from "sequelize";
import { MyUserRequest } from "../../interfaces/commonInterface";
import { generateResponse } from "../../services/response";
import HttpStatusMessage from "../../constant/responseConstant";
import { azurEmailFunction } from "../../emailSender/emailSentWithAttachment"
import GeneratePdf from "../../services/generatePdf"
import { comapnyDbAlias } from "../../constant";
import { isCompanyEnable } from "../../utils";

class PdfSendEmailController {
  // Private property for the database connection (Sequelize instance)
  private readonly connection: Sequelize;

  // Constructor to initialize the database connection for each instance
  constructor(connectionData: Sequelize) {
    this.connection = connectionData; // Assign the passed Sequelize instance to the private property
  }

  // API handler function
  async sendEmissionReportEmail(
    request: MyUserRequest,
    res: Response
  ): Promise<Response> {
    try {
      let authenticate: any = this.connection;
      if(isCompanyEnable(authenticate.company, [comapnyDbAlias.PEP, comapnyDbAlias.GEN])){
        let { pdf= 'period' , period , division_id } = request.body;
        let instance = '';
        if (pdf === 'period') {
          instance = 'generatePdfPeriodWisePepsi';
        }
        const classTest: any = new GeneratePdf()

        const { fileName, buffer, subject, body } = await classTest[instance](authenticate[authenticate.company], period, division_id)

        const sentUser: any = process.env.CRON_EMAIL_USER?.split(',') || []


        const payload = {
          to: sentUser.map((ele: any) => {
            return { address: ele }
          }),
          fileBuffer: buffer,
          fileName: fileName,
          fileType: "application/pdf",
          subject: subject,
          html: `<p>${body} </p>`
        }
        await azurEmailFunction(payload, '', process.env.PEPSI_WEST_SENDER_ADDRESS)
        return generateResponse(res, 200, true, "Email sent successfully.", {});
      }
      return generateResponse(res, 200, false, "You are not allowed to send pdf.", {});
    }
    catch (err) {
      console.error(err, "check err ")
      return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
    }
  }

}

export default PdfSendEmailController;
