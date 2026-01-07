enum htmlConstant  {
    lane_name = `<td>
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <h3 style="font-size: 16px; font-weight: 400; margin: 0px ;">
                                    Lane Name<span
                                            style="font-weight: 600; font-size: 18px; margin-left: 6px;">#VALUE#</span>
                                    </h3>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>`,
    distance = `<td style="width: 250.3px;">
                    <table>
                        <tbody>
                            <tr>
                                <td style="width: 36px;">
                                    <img src="#base_url#/emailTemplate/distance.png" />
                                </td>
                                <td>
                                <h3 style="font-size: 14px; font-weight: 400; margin: 0px ;">
                                        Distance <span
                                            style="font-weight: 600; font-size: 16px; color: #5F9A80; margin-left: 6px;">#VALUE#</span>
                                    </h3>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>`,
    transit_time = `<td style="width: 245.3px;">
                        <table>
                            <tbody>
                                <tr>
                                    <td style="width: 36px;" >
                                    <img src="#base_url#/emailTemplate/time.png" />
                                    </td>
                                    <td style="vertical-align: middle;">
                                        <h3 style="font-size: 14px; font-weight: 400; margin: 0px ;">
                                            Transit Time <span
                                                style="font-weight: 600; font-size: 16px; color: #5F9A80; margin-left: 6px;">#VALUE#</span>
                                        </h3>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>`,
    cost = `<td style="width: 191.3px;">
                <table>
                    <tbody>
                        <tr>
                            <td style="width: 36px;">
                            <img src="#base_url#/emailTemplate/cost.png" />

                            </td>
                            <td style="vertical-align: middle;"> 
                                <h3 style="font-size: 14px; font-weight: 400; margin: 0px ;">
                                    Cost <span
                                        style="font-weight: 600; font-size: 16px; color: #5F9A80; margin-left: 6px;">#VALUE#</span>
                                </h3>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>`,
    emissions_reduction = `<td style="width: 243.3px;">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td style="width: 36px;">
                                                <img src="#base_url#/emailTemplate/emission.png" />
                                            </td>
                                            <td style="vertical-align: middle;">
                                                <h3 style="font-size: 14px; font-weight: 400; margin: 0px ;">
                                                    Emissions Reduction <span
                                                        style="font-weight: 600; font-size: 16px; color: #5F9A80; margin-left: 6px;">#VALUE#</span>
                                                </h3>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>`
    ,
    emissions_reduction_spent = `<td style="width: 331.3px;">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td style="width: 36px;">
                                                    <img src="#base_url#/emailTemplate/reduction-cost.png" />
                                                </td>
                                                <td style="vertical-align: middle;">
                                                    <h3 style="font-size: 14px; font-weight: 400; margin: 0px ;">
                                                                Emission Reduction/$ spent <span
                                                            style="font-weight: 600; font-size: 16px; color: #5F9A80; margin-left: 6px;">#VALUE#</span>
                                                    </h3>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>`,
    rail_provider = `<td style="width: 243.3px; ">
                        <table>
                            <tbody>
                                <tr>
                                    <td style="width: 36px;">
                                        <img src="#base_url#/emailTemplate/rail.png" />
                                    </td>
                                    <td>
                                        <h3 style="font-size: 14px; font-weight: 400; margin: 0px ;">
                                            Rail Provider<span
                                                style="font-weight: 600; font-size: 16px; color: #5F9A80; margin-left: 6px;">#VALUE#</span>
                                        </h3>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>`,
    carrier_provider = `<td style="width: 331.3px;">
                            <table>
                                <tbody>
                                    <tr>
                                        <td style="width: 36px;">
                                            <img src="#base_url#/emailTemplate/carrier.png" />
                                        </td>
                                        <td>
                                            <h3 style="font-size: 14px; font-weight: 400; margin: 0px ;">
                                                Carrier Provider <span
                                                    style="font-weight: 600; font-size: 16px; color: #5F9A80; margin-left: 6px;">#VALUE#</span>
                                            </h3>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>`,
    fuel_type = `<table>
    <tr>
        <td style="width: 243.3px;">
            <table>
                <tbody>
                <tr>
                    <td style="width: 36px;">
                        <div>
                            <img src="#base_url#/emailTemplate/fuelType.png" />
                        </div>
                    </td>
                    <td>
                        <h3 style="font-size: 14px; font-weight: 400; margin: 0px ;">
                            Fuel Type <span
                                style="font-weight: 600; font-size: 16px; color: #5F9A80; margin-left: 6px;">#VALUE#</span>
                        </h3>
                    </td>
                </tr>
                </tbody>
            </table>
        </td>
    </tr>
</table>`,
    ev_charger = `<table>
    <tr>
        <td style="width: 331.3px;">
            <table>
                <tbody>
                    <tr>
                    <td style="width: 36px;">
                        <img src="#base_url#/emailTemplate/ev.png" />
                        </td>
                        <td>
                            <h3 style="font-size: 14px; font-weight: 400; margin: 0px ;">
                                EV Charging<span
                                style="font-weight: 600; font-size: 16px; color: #5F9A80; margin-left: 6px;">#VALUE#</span>
                            </h3>
                        </td>   
                    </tr>
                </tbody>
            </table>
        </td>
    </tr>
</table>`,
    'redDownArrow.svg' = `<span ><img src="#base_url#/emailTemplate/up-arrow.png" /></span>`,
    'greenArrowDowm.svg' = `<span ><img src="#base_url#/emailTemplate/down-arrow.png" /></span>`,
}

export default htmlConstant as any;