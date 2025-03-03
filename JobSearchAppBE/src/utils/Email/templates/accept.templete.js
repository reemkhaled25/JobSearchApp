export const acceptanceEmailTemplete = ({

    applicationOwner = '',
    jobTitle = '',
    companyName = '',
    companyEmail = '',
    HRName = '',
    startDate = Date.now(),
    responseDeadline = Date.now(),
    salary = '20000',

} = {}) => {

    return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <p style="color:#eeee;text-align: justify;">
        Dear ${applicationOwner},<br><br>

        I hope this message finds you well. We are pleased to formally extend an offer for the ${jobTitle} position at
        ${companyName}.<br>
        We believe your skills and experience will be a significant contribution to our team.<br><br>

        As discussed, your starting date will be ${new Date(startDate).toLocaleDateString()}. Your annual salary will be ${salary}, and you will
        be reporting to Mr.${HRName}.<br>
        Additional details regarding benefits and the onboarding process will be provided shortly.<br><br>

        Please confirm your acceptance of this offer by responding to this email by ${new Date(responseDeadline).toLocaleDateString()}. We are excited
        to have you join us and look forward to a successful collaboration.

        If you have any questions or need further information, feel free to reach out.<br>

        Congratulations, and welcome to the team!<br><br>

        Best regards,<br>
        HR, ${HRName} <br><br>
        ${companyName} <br>
        ${companyEmail}
    </p>
</body>

</html>`

}