export const userRoleChange = async () => {
    return `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>email-template</title>
        <style>
            body {
                padding: 0;
                margin: 0;
                background-color: #f7f7f7;
            }
    
            * {
                box-sizing: border-box;
            }
    
            #mail {
                max-width: 690px;
            }
        </style>
    </head>
    
    <body>
        <table
            style="width:100%; max-width: 690px;  margin: 0 auto; font-family: Poppins, sans-serif;  background-color: #fff;"
            cellspacing="0px">
            
            <tbody>
                <tr>
                    <td>
                        <table style="width:100%; max-width: 690px;  margin: 0 auto; font-family: Poppins, sans-serif;  background-color: #fff; padding: 20px">
                            <tbody>
                                <tr style="background-color:#F7F9FC;">
                                    <td style="border-bottom: 1px solid #d5d5d5; padding:16px">
                                        <img src="./images/logo.png"/>
                                    </td>
                                </tr>
                                <!-- alternative fuel -->
                                <tr style="margin-bottom: 10px;">
                                    <td style="background-color:#F7F9FC; padding: 16px; border-radius: 4px;">
                                        
                                        <table>
                                            <tr>
                                                <td>
                                                  <h3 style="margin: 5px 0px 10px 0px">Account Logout Due to Role Change</h3>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <h5 style="margin: 3px 0px 14px 0px; color:#414141; font-size: 16px;">Dear #USERNAME#,</h5>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <p style="margin: 0px 0px 10px 0px; color:#414141">We hope this message finds you well.</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <p style="margin: 0px 0px 10px 0px; color:#414141;line-height: 1.6;text-align: justify;">We are writing to inform you that your account on our platform has been logged out due to a recent role change.  After a review of your account, it has been determined that your role has been changed from #PREVIOUS_ROLE# to #ROLE#. As a result, access privileges associated with your previous role have been revoked, necessitating the logout from your account. This action was taken to ensure compliance with our security protocols and to align your access with your updated role within the organization.
                                                        We understand that transitions like this can sometimes cause inconvenience, but we are committed to ensuring the security and integrity of our platform.
                                                        We're here to assist you with any concerns or inquiries you may have.
                                                        Thank you for your understanding and cooperation in this matter.</p>
                                                </td>
                                            </tr>
                                        </table>
                                        <table>
                                            <tr>
                                                <td>
                                                    <h5 style="margin: 0px 0px 10px 0px; color:#414141; font-size: 16px;">Best Regards,</h5>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <h5 style="margin: 0px 0px 10px 0px; color:#414141;font-size: 16px;">Team GreenSight</h5>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        
                    </td>
                </tr>
              
            </tbody>
        </table>
    </body>
    
    </html>`;
}

