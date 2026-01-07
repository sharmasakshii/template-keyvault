export const projectSummary = async () => {
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
                max-width: 740px;
            }
        </style>
    </head>
    
    <body>
        <table
            style="width:100%; max-width: 740px;  margin: 0 auto; font-family: Poppins, sans-serif;  background-color: #fff;"
            cellspacing="0px">
            <thread>
                <tr>
                    <th style="text-align: left; padding: 20px; border-bottom: 1px solid #cacaca;">
                        <img src="#base_url#/emailTemplate/logo.png" />
                    </th>
                </tr>
            </thread>
            <tbody>
                <tr>
                    <td>
                        <table style="width:100%; max-width: 740px;  margin: 0 auto; font-family: Poppins, sans-serif;  background-color: #fff; padding: 20px">
                            <tbody>
                                <tr>
                                    <td>
                                        <h1 style="text-align: left; font-size: 20px; font-weight: 600; margin-top: 0px;">Project Name</h1>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <h4 style="text-align: left; font-size: 16px; font-weight: 400; margin: 0px 0px 7px;">
                                            #PROJECT_NAME#
                                        </h4>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <h1 style="text-align: left; font-size: 20px; font-weight: 600;">Project Summary</h1>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <h4 style="text-align: left; font-size: 16px; font-weight: 400; margin: 0px 0px 7px;">
                                            #DESCRIPTION#
                                        </h4>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <h2 style="text-align: left; font-size: 20px; font-weight: 600;">Suggested change</h2>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="background-color:#F7F9FC; padding: 10px; border-radius: 4px;">
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <ul style="padding-left: 16px; margin: 8px 8px 8px 10px;">
                                                            <li>
                                                                #SUGGESTED_CHANGES#
                                                            </li>
                                                        </ul>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <h2 style="text-align: left; font-size: 20px; font-weight: 600;">Recommendation Metrics</h2>
                                    </td>
                                </tr>
                                <tr style="margin-bottom: 10px;">
                                    <td style="background-color:#F7F9FC; padding: 10px; border-radius: 4px;">
                                        <table>
                                            <tr>
                                                <td>
                                                    <table>
                                                        <tbody>
                                                            <tr>
                                                                <td>
                                                                    <h3 style="font-size: 16px; font-weight: 400; margin: 0px ;">
                                                                    Lane Name<span
                                                                            style="font-weight: 600; font-size: 16px; color: #5F9A80; margin-left: 6px;">#LANE_NAME#</span>
                                                                    </h3>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                        <table>
                                            <tr>
                                                #distance#
                                                #transit_time#
                                                #cost#
                                            </tr>
                                        </table>
                                        <table>
                                            <tr>
                                            #emissions_reduction#
                                            #emissions_reduction_spent#
                                            </tr>
                                        </table>
                                        <table>
                                            <tr>
                                            #rail_provider#
                                            #carrier_provider#
                                            </tr>
                                        </table>
                                        
                                        #ev_charger#
                                        #fuel_type#
                                        
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table style="background-color: #F7F9FC; width:100%; max-width: 740px; padding: 6px;">
                            <tr style="text-align:center">
                                <td style="text-align:center; color: #c7c7c7;" colspan="2">
                                <img src="#base_url#/emailTemplate/logo.png" />
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    </body>
    
    </html>`;
}

