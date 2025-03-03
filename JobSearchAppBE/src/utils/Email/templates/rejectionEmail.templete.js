export const rejectionEmailTemplete = ({
    applicationOwner = '',
    jobTitle = '',
    companyName = '',
    HRName = ''

} = {}) => {

    return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <p style="color:#eeee;text-align: justify;">Dear ${applicationOwner},<br><br>

        Thank you for your interest in the ${jobTitle} role at ${companyName}. We appreciate the time and effort you
        invested in applying for this position.<br><br>

        After careful consideration, we have decided not to move forward with your application at this time. We received
        a significant number of applications from qualified candidates like yourself, making this selection process
        extremely difficult.<br><br>

        We appreciate the strengths you demonstrated in your CV and if a suitable position opens up in the future, we
        would be happy to hear from you and consider your application again.<br><br>

        If you have any feedback for us about our application process, we welcome your input as it helps us learn and
        improve!
        We sincerely appreciate your interest in ${companyName} and wish you all the best in your job search.<br>

        Best regards,<br>
        HR, ${HRName}</p>
</body>

</html>`
}