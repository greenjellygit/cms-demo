import mjml2html from 'mjml'
import { MailTemplateCreator, MailType } from './definitions'

export const buildRegistrationTemplate: MailTemplateCreator<MailType.REGISTRATION> = ({
    recipientName,
    registrationLink,
    welcomeImage,
    someImageUrl,
}) =>
    mjml2html(`
        <mjml>
            <mj-body background-color="#F4F4F4">
            <mj-section background-color="#eeeeee" background-repeat="repeat" padding-bottom="0px" padding-top="10px" padding="20px 0" text-align="center">
                <mj-column>
                <mj-text align="left" color="#55575d" font-family="Arial, sans-serif" font-size="30px" line-height="22px" padding="10px 25px" padding-bottom="20px">
                    <p style="line-height: 30px; margin: 10px 0; text-align: center; color:#151e23; font-size:30p; font-family:Georgia,Helvetica,Arial,sans-serif">Simple Shopping List</p>
                </mj-text>
                </mj-column>
            </mj-section>
        
            <mj-section background-color="#ffffff" background-repeat="repeat" padding-bottom="0px" padding="20px 0" text-align="center">
                <mj-column>
                <mj-text align="left" color="#55575d" font-family="Arial, sans-serif" font-size="13px" line-height="22px" padding-bottom="0px" padding-left="40px" padding-right="40px" padding-top="0px" padding="10px 25px">
                    <p style="margin: 10px 0; color:#151e23; font-size:16px; font-family:Georgia,Helvetica,Arial,sans-serif"><b>Dear ${recipientName}</b></p>
                    <p style="line-height: 16px; margin: 10px 0;font-size:14px; color:#151e23; font-family:Georgia,Helvetica,Arial,sans-serif; color:#354552">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
                </mj-text>
                </mj-column>
            </mj-section>

            <mj-section>
            <mj-column>
              <mj-image width="100px" src="${someImageUrl}" />
            </mj-column>
          </mj-section>

            <mj-section>
            <mj-column>
              <mj-image width="300px" src="cid:${welcomeImage.fileName}" />
            </mj-column>
          </mj-section>
        
            <mj-section background-color="#ffffff" background-repeat="repeat" padding-top="0px" padding="20px 0" padding-bottom="0px" text-align="center">
                <mj-column>
                <mj-button align="center" background-color="#354552" border-radius="3px" color="#ffffff" font-family="Georgia, Helvetica, Arial, sans-serif" font-size="14px" font-weight="normal" inner-padding="10px 25px" padding="10px 25px" text-decoration="none" text-transform="none" vertical-align="middle" href="${registrationLink}">Confirm registration</mj-button>
                </mj-column>
            </mj-section>
        
            <mj-section background-color="#ffffff" background-repeat="repeat" padding="10px 0" text-align="center">
                <mj-column>
                <mj-text align="center" font-weight="300" font-size="23px" line-height="40px" color="#5FA91D">We just make it simple ;)</mj-text>
                <mj-social align="center">
                    <mj-social-element name="facebook"></mj-social-element>
                    <mj-social-element name="linkedin"></mj-social-element>
                    <mj-social-element name="twitter"></mj-social-element>
                </mj-social>
                </mj-column>
            </mj-section>
            </mj-body>
        </mjml>
    `)
