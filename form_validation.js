function Validator(formSelector) {
    function formgetParent(element, selector) {
        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }
            element = element.parentElement
        }
    }

    var formRules ={};  //  object địa chỉ của các input với các rule tương ứng. 
    
    // quy uoc tao rules
    // - Nếu có lỗi thì thì return lại gia trị của lỗi ; - Nếu không thì return lại undefined
    var validatorRules = {    // Object Gộp chung định nghĩa của các rule với hàm tương ứng  vào thành 1 object để sau
        //truy xuất cho dễ

        required: function(value){
            return value ? undefined : 'vui lòng điền vào trường này';
        },
        email: function(value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
             return regex.test(value) ? undefined : 'vui lòng nhập đúng định dạng Email';
        },
        min: function(min){      // function lay gia tri min với min chính là biến của hàm này
            return function(value){    // function so sánh độ dài kí tự với min.
                return value.length >= min ? undefined : `nhap toi thieu ${min} ki tu`;
            }
        }
    }

    //lay ra form element theo bien formSelector. 
    var formElement = document.querySelector(formSelector);
    
    //check ton tai của form. 
    if(formElement){
        var inputs =formElement.querySelectorAll('[name][rules]')
      
        for (var input of inputs){
            var rules = input.getAttribute('rules').split('|');
        
           for (var rule of rules){
            var ruleInfo;
            var isRuleHasValue = rule. includes(":");
              if(isRuleHasValue){
                ruleInfo = rule.split(':');
                rule = ruleInfo[0];
              }

              var ruleFunc = validatorRules[rule];  // function này là 1 phần tử con của 1 object.
              if(isRuleHasValue){
                ruleFunc = ruleFunc(ruleInfo[1]);  //gán cho nó 1 biến nó sẽ chạy cái hàm này và sẽ
                //lộ ra hàmm con chứa bên trong nó.
              }

              
              //console.log (rule)

              if(Array.isArray(formRules[input.name])){
                formRules[input.name].push(ruleFunc)

              }else{
                formRules[input.name] = [ruleFunc];  // gán array cho 1 key trong 1 object.
                // mỗi key này đại diện cho một name của 1 input và chứa cáv value là các function 
                //mà muốn áp lên input đó.
              }
           }

           input.onblur = handleValidate;
           input.oninput = handleClearError;

        }

         function handleValidate(event){
            var errorMessage;
           var rules =formRules[event.target.name];
            rules.find(function (rule) {
             errorMessage = rule(event.target.value);
            return errorMessage ;
           });
          if(errorMessage){
            console.log (event.target);
            var formGroup = formgetParent(event.target, '.form-group')
            if(formGroup){
                formGroup.classList.add('invalid');
                var formMessage = formGroup.querySelector('.form-message');
                if (formMessage) {
                    formMessage.innerText = errorMessage;
                }

            }
          }

         }
         function handleClearError(event) {
            var formGroup =  formgetParent(event.target, '.form-group');
            if(formGroup.classList.contains('invalid')){
                formGroup.classList.remove('invalid');

                var formMessage = formGroup.querySelector('.form-message');
                if(formMessage){
                    formMessage.innerText = "";
                }

            }
         }

    }
    //  console.log (formRules)
}
