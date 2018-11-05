module.exports = (message, email, first, last) => `
<table class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;" border="0" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
<td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;">
<div class="content" style="box-sizing: border-box; display: block; margin: 0 auto; max-width: 580px; padding: 10px;">
<table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;"><!-- START MAIN CONTENT AREA -->
<tbody>
<tr>
<td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;">
<table style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" border="0" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td style="font-family: sans-serif; font-size: 14px; vertical-align: top;"><img style="margin: auto; align-items: center; display: flex; justify-content: center;" src="https://cdn.filestackcontent.com/wPQCRZ1rSq7V1zSrdg39" width="100" height="100" />
<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">Hello Bay Area Brewers Guild,</p>
<p>First Name: ${first}</p>
<p>Last Name: ${last}</p>
<p>Email: ${email}</p>
<p>Message:</p>
<p>${message}</p>
<table class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;" border="0" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td style="display: flex; justify-content: center;font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;" align="left">
</td>
</tr>
<!-- END MAIN CONTENT AREA --></tbody>
</table>
<!-- START FOOTER -->
<div class="footer" style="clear: both; margin-top: 10px; text-align: center; width: 100%;">
<table style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" border="0" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td class="content-block" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;"><span class="apple-link" style="color: #999999; font-size: 12px; text-align: center;">&copy;2018 San Francisco Brewers Guild. All Rights Reserved.</span></td>
</tr>
</tbody>
</table>
</div>
<!-- END FOOTER --> <!-- END CENTERED WHITE CONTAINER --></div>
</td>
<td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
</tr>
</tbody>
</table>
`;
