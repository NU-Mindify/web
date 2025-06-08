import React from 'react'
import parse from "html-react-parser";

const termsAndConditions = `
**Terms and Conditions for NU Mindify**
Last Updated: April 15, 2025

**1. Acceptance of Terms**
By downloading, installing, accessing, or using the NU Mindify application (the "App"), you ("User" or "you") agree to be bound by these Terms and Conditions (the "Terms"). If you do not agree to these Terms, do not download, install, access, or use the App.

**2. Description of the App**
NU Mindify is a gamified reviewer designed to help aspiring psychometricians at National University Mall of Asia (NU MOA) prepare for their licensure examination through interactive and engaging learning experiences. The App may include, but is not limited to, practice questions, quizzes, educational content, progress tracking, and gamified elements such as points, badges, and leaderboards.

**3. User Accounts**
3.1. Account Creation: You may be required to create an account to access certain features of the App. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.  
3.2. Account Security: You are responsible for maintaining the confidentiality of your account credentials (username and password) and for all activities that occur under your account. You agree to notify us immediately of any unauthorized access to or use of your account.
3.3. Eligibility: By creating an account, you represent and warrant that you are of legal age and have the legal capacity to enter into these Terms.

**4. Use of the App**
**4.1. License Grant:** Subject to these Terms, NU Mindify grants you a limited, non-exclusive, non-transferable, revocable license to download, install, and use the App on your personal device for the sole purpose of preparing for the psychometrician licensure examination.
**4.2. Acceptable Use:** You agree to use the App in a manner that is lawful, ethical, and in accordance with these Terms. You shall not: * Use the App for any illegal or unauthorized purpose. * Attempt to interfere with, compromise the system integrity or security, or decipher any transmissions to or from the servers running the App. * Attempt to decompile, reverse engineer, disassemble, or otherwise attempt to discover the source code of the App. * Modify, adapt, translate, or create derivative works based upon the App. * Distribute, sublicense, rent, lease, loan, or otherwise transfer the App to any third party. * Upload or transmit any viruses, worms, or other malicious code. * Collect or harvest any personally identifiable information from other users of the App without their consent. * Engage in any conduct that restricts or inhibits anyone's use or enjoyment of the App, or which, as determined by NU Mindify, could harm NU Mindify or users of the App or expose them to liability. * Circumvent any technological measure implemented by NU Mindify to protect the App or its content.   
**4.3. Educational Content:** The content provided within the App is for educational purposes only and should not be considered a substitute for professional advice or comprehensive study materials. NU Mindify does not guarantee the accuracy, completeness, or effectiveness of the educational content.
**4.4. Gamified Features:** The gamified elements within the App are intended to enhance engagement and motivation. These features are not indicative of actual performance in the licensure examination.

**5. Intellectual Property**
**5.1. Ownership:** The App and its original content, including but not limited to text, graphics, images, logos, software, and the design and structure of the App, are owned by or licensed to NU Mindify and are protected by copyright, trademark, and other intellectual property laws.
**5.2. Limited Rights:** You are granted a limited license to use the App as outlined in Section 4.1. Nothing in these Terms shall be construed as transferring any ownership rights in the App or its content to you.
**5.3. Trademarks:** "NU Mindify" and the NU Mindify logo are trademarks of NU Mindify. You are not permitted to use these trademarks without our prior written consent.

**6. User-Generated Content**
The App may allow users to submit, post, or display content (e.g., comments, feedback). By submitting User-Generated Content, you grant NU Mindify a non-exclusive, worldwide, royalty-free, perpetual, irrevocable, sub-licensable, and transferable license to use, host, store, reproduce, modify, create derivative works, communicate, publish, publicly perform, publicly display, and distribute such User-Generated Content in connection with the App and NU Mindify's business. You represent and warrant that you have all necessary rights to grant us this license and that your User-Generated Content does not violate any third-party rights.

**7. Privacy**
Your privacy is important to us. Please review our Privacy Policy [Insert Link to Privacy Policy Here], which explains how we collect, use, and disclose your personal information. By using the App, you consent to the practices described in the Privacy Policy.

**8. Disclaimer of Warranties**
THE APP IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, AND ANY WARRANTIES ARISING OUT OF COURSE OF DEALING OR USAGE OF TRADE. NU MINDIFY DOES NOT WARRANT THAT THE APP WILL BE UNINTERRUPTED, ERROR-FREE, SECURE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS. NU MINDIFY MAKES NO WARRANTIES REGARDING THE RESULTS THAT MAY BE OBTAINED FROM THE USE OF THE APP OR THE ACCURACY, COMPLETENESS, OR RELIABILITY OF ANY CONTENT PROVIDED THROUGH THE APP.

**9. Limitation of Liability**
TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL NU MINDIFY, ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, SUPPLIERS, OR LICENSORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES (INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES) ARISING OUT OF OR RELATING TO YOUR ACCESS TO OR USE OF, OR INABILITY TO ACCESS OR USE, THE APP, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), STATUTE, OR ANY OTHER LEGAL THEORY, EVEN IF NU MINDIFY HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. IN NO EVENT SHALL NU MINDIFY'S TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THESE TERMS OR THE APP EXCEED THE AMOUNT YOU PAID, IF ANY, TO NU MINDIFY FOR ACCESSING OR USING THE APP IN THE TWELVE (12) MONTHS PRIOR TO THE EVENT GIVING RISE TO THE LIABILITY.  

**10. Indemnification**
You agree to indemnify, defend, and hold harmless NU Mindify, its affiliates, officers, directors, employees, agents, suppliers, and licensors from and against any and all claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your (a) use of or access to the App; (b) violation of these Terms; or (c) violation of any third-party right, including without limitation any intellectual property right or privacy right.

**11. Termination**
NU Mindify may terminate or suspend your access to the App, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms. Upon termination, your right to use the App will immediately cease. All provisions of these Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.

**12. Governing Law and Dispute Resolution  ** 
These Terms shall be governed by and construed in accordance with the laws of the Republic of the Philippines, without regard to its conflict of law provisions. Any dispute arising out of or relating to these Terms or the App shall be exclusively resolved in the courts located in Pasay City, Metro Manila, Philippines, and you hereby consent to the personal jurisdiction of such courts. 

**13. Changes to These Terms**
NU Mindify reserves the right to modify or revise these Terms at any time by posting the updated Terms within the App or on our website. Your continued use of the App after the posting of any changes constitutes your acceptance of such changes. You are responsible for regularly reviewing these Terms.

**14. Entire Agreement**
These Terms constitute the entire agreement between you and NU Mindify regarding your use of the App and supersede all prior and contemporaneous agreements and understandings, whether written or oral.

**15. Contact Us**
If you have any questions about these Terms, please contact us at:
numindify@gmail.com

**Data Privacy Consent for NU Mindify**
Last Updated: April 15, 2025

By downloading, installing, accessing, or using the NU Mindify application (the "App"), you ("User" or "you") acknowledge that you have read and understood this Data Privacy Consent and voluntarily consent to the collection, use, processing, storage, retention, and disclosure of your personal data as described herein.
**1. Information We Collect**
We may collect the following types of personal data from you:
Account Information: When you create an account, we may collect your name, email address, and any other information you voluntarily provide during the registration process.
**Usage Data:** We may collect information about how you use the App, including your progress, scores, the types of questions you interact with, the time spent on different sections, and your learning patterns.  
**Device Information:** We may collect information about the device you use to access the App, such as the device model, operating system, unique device identifiers, and mobile network information.
**Log Data:** Our servers may automatically record certain information when you access or use the App, including your IP address, browser type, referring/exit pages, operating system, date/time stamps, and related data.
User-Generated Content: If you submit, post, or display content within the App (e.g., feedback, comments), this information may be collected and processed.

**2. How We Use Your Personal Data**
We may use your personal data for the following purposes:
**To Provide and Personalize the App:** To deliver the features and functionalities of the App, including providing practice questions, tracking your progress, and personalizing your learning experience based on your performance.
**To Improve the App:** To analyze user behavior and trends to understand how the App is used and to make improvements, updates, and develop new features.
**To Communicate with You:** To send you important notices, updates, and information related to the App, as well as respond to your inquiries and feedback.
**For Gamification Purposes:** To administer and track your progress within the gamified elements of the App, such as awarding points, badges, and displaying your position on leaderboards (if applicable).
**For Research and Analytics:** To conduct research and analyze data to improve the effectiveness of the App and the learning experience for aspiring psychometricians at NU MOA. Any such research will be conducted in an anonymized or aggregated manner where possible.
**To Ensure Security and Prevent Fraud:** To monitor and analyze activity on the App to detect, prevent, and address potential security incidents, fraud, and other unauthorized activities.
**To Comply with Legal Obligations:** To comply with applicable laws, regulations, legal processes, or governmental requests.

**3. How We Share Your Personal Data**
We may share your personal data with the following categories of recipients:
Service Providers: We may engage third-party service providers to assist us with various functions, such as hosting, data analytics, customer support, and email delivery. These service providers will have access to your personal data only to the extent necessary to perform their services and are obligated to maintain its confidentiality and security.  
National University (NU) MOA (Limited): In some cases, and with your explicit consent where required, we may share anonymized or aggregated data regarding overall app usage and learning trends with NU MOA for the purpose of improving their psychometrician programs. We will not share your individual personal data with NU MOA without your explicit consent unless required by law or legal process.
Legal Authorities: We may disclose your personal data to law enforcement agencies, government authorities, or other third parties if required to do so by law or legal process, or if we believe in good faith that such disclosure is necessary to (a) protect our rights, property, or safety, or the rights, property, or safety of others; (b) investigate fraud or illegal activities; or (c) respond to a government request.
Business Transfers: In the event of a merger, acquisition, reorganization, sale of assets, or other similar corporate transaction, your personal data may be transferred to the acquiring entity or third party involved, in accordance with applicable data protection laws.

**4. Data Retention**
We will retain your personal data for as long as necessary to fulfill the purposes for which it was collected, as outlined in this Data Privacy Consent, or for a longer period if required or permitted by law. When your personal data is no longer needed, we will take reasonable steps to securely destroy or anonymize it.  

**5. Your Rights as a Data Subject**
Under the Data Privacy Act of 2012, you have certain rights regarding your personal data, including:
Right to be Informed: You have the right to be informed about the collection and processing of your personal data.
Right to Object: You have the right to object to the processing of your personal data under certain circumstances.  
Right to Access: You have the right to request access to your personal data that we hold.
Right to Rectification: You have the right to request the correction of any inaccurate or incomplete personal data.  
Right to Erasure or Blocking: You have the right to request the removal or blocking of your personal data under certain circumstances. 
Right to Data Portability: You have the right to obtain a copy of your personal data in a commonly used electronic format.
Right to File a Complaint: You have the right to file a complaint with the National Privacy Commission (NPC) if you believe your rights have been violated.
To exercise any of these rights, please contact us using the contact information provided in Section 8 below. We may require you to verify your identity before responding to your request.

**6. Security Measures**
We implement reasonable and appropriate organizational, physical, and technical security measures to protect your personal data against unauthorized access, use, disclosure, alteration, or destruction. These measures are continuously reviewed and updated to maintain the security of your personal data.

**7. Changes to this Data Privacy Consent**
We may update this Data Privacy Consent from time to time to reflect changes in our data processing practices or applicable laws. We will notify you of any material changes by posting the updated Data Privacy Consent within the App or through other reasonable means. Your continued use of the App after the posting of any changes constitutes your acceptance of the revised Data Privacy Consent.

**8. Contact Us**
If you have any questions, concerns, or requests regarding this Data Privacy Consent or the processing of your personal data, please contact us at:
numindify@gmail.com

By clicking "I Agree" or by continuing to use the NU Mindify App, you signify your free and informed consent to the collection, use, processing, storage, retention, and disclosure of your personal data as described in this Data Privacy Consent.
`
function formatAIText(message) {
  return message
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)/g, '<br><b className="pt-12">• </b>')
    .replace(/\n/g, "<br>");
}

const TermsAndConditions = () => {
  return (
    <div className='!overflow-auto !h-[100svh] bg-white text-black p-8 pt-2'>
      <div className='!overflow-auto !h-fit max-w-[60rem] mx-auto'>
        {parse(formatAIText(termsAndConditions))}
      </div>
    </div>
  );
};

export default TermsAndConditions;