
let form = document.forms;
let firstInput = form[0].elements[0];
let secondInput = form[0].elements[1];
let invalidDiv = document.querySelector(".invalid-feedback");
let errorModal = new bootstrap.Modal(document.getElementById("errorModal"));
console.log(errorModal)


let firstInputValue = ""

//update the first input password variable on defocusing from the input element
firstInput.addEventListener("blur",(event) => {
    firstInputValue = firstInput.value
})

let btn = document.getElementById("submit-button")
btn.addEventListener("click",async (event) => {
    event.preventDefault();

    //validate the input on submit
    if(firstInput.value != secondInput.value){
        invalidDiv.innerText = "Password does not match"
        secondInput.classList.add("is-invalid")
    }else{

        //remove the error message from form and send the request to server
        secondInput.classList.remove("is-invalid")
        let url = window.location.href;

        //send the request to server to reset the password
        try{
            let passwordResetResponse = await fetch(url,{
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    password: secondInput.value
                })
            })

            //verify the server response and proceed futher accordinglt
            if(passwordResetResponse.ok){
                //parse the json on succesfull server response and redirect to success page and delete browser stack history
                let json = await passwordResetResponse.json();
                window.location.href = json.forward;
            }else{
                //change the modal error title according to response
                let errorModalTitleDiv = document.getElementById("modalTitle");
                errorModalTitleDiv.innerText = `Error ${passwordResetResponse.status}`

                //change the modal error content according to response
                let errorModalContent = document.getElementById("modalContent");
                passwordResetResponse.text().then((resolve, reject) => {
                    console.log(resolve)
                    errorModalContent.innerText = resolve
                    return
                }).then((resolve, reject) => {
                    errorModal.show()
                })
            }
        }catch(error){

            //when unable to send the fetch request
            console.log(error);
            let errorModalTitleDiv = document.getElementById("modalTitle");
            errorModalTitleDiv.innerText = `Network Error`
            let errorModalContent = document.getElementById("modalContent");
            errorModalContent.innerText = `Unable to send the request. Please check you internet or try again later`

        }
        
    }
})

secondInput.addEventListener("change",(event) => {
    if(firstInputValue === secondInput.value){
        secondInput.classList.remove("is-invalid")
    }
})

secondInput.addEventListener("blur", (event) => {
    if(firstInputValue != secondInput.value){
        invalidDiv.innerText = "Password does not match"
        secondInput.classList.add("is-invalid")
    }
})