import fetch from 'node-fetch'
async function sendWhatsAppTemplateMessage(
	receiversPhoneNumber,
  templateName,
	templateComponentsArray
) {
  try{
    let response = await fetch(
      "https://graph.facebook.com/v15.0/106581678910642/messages",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: String(receiversPhoneNumber),
          type: "template",
          recipient_type: "individual",
          template: {
            name: templateName,
            language: {
              code: "en",
            },
            components: templateComponentsArray
          },
        }),
      }
    );
    let responseJson = await response.json();
    if(response.ok){
      return responseJson
    }else{
      console.log(`${new Date()}: [[Invalid Response from WhatsApp]]`);
      console.log(responseJson);
      throw new WA_Message_Error("Invalid response from WhatsApp")
    }
  
  }catch(error){
    if(error.name === "WA_Message_Error"){
      throw error
    }
    throw new WA_Message_Error("Unable to reach the whatsApp server for sending OTP")
  }
}

class WA_Message_Error extends Error{
  constructor(message){
    super(message);
    this.name = "WA_Message_Error"
  }
}

export default sendWhatsAppTemplateMessage