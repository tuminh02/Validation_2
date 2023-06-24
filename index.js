function validator(formSelector){

    //lấy thẻ cha
    function getParentGroup(element, selector){

        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                            return element.parentElement;
                        }
                        element = element.parentElement;
        }
    }



    var formRules = {};
    var validatorRules = {
        required: function(value){
            return value ? undefined : 'Vui long nhap truong nay'
        },
        email: function(value){
            // regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)? undefined : 'vui long nhap email';
        },
        min: function(min){
            return function(value){
                return value.length >= min ? undefined : `vui long nhap toi thieu ${min} ki tu`;
            }
        }
    };
    //lấy ra form element trong DOM theo `formSelector`
    var formElement = document.querySelector(formSelector);
    // chỉ xử lý khi có element trong DOM 
    if(formElement){
        var inputs = formElement.querySelectorAll('[name][rule]');
        for(var input of inputs){
            var rules = input.getAttribute('rule').split('|');

           //tach va lay gia tri min 
           for(var rule of rules){
                var isRuleHasValue = rule.includes(':')
                var ruleInfo;
                // tach rule value co dau : va get min 
                if(isRuleHasValue){

                    ruleInfo = rule.split(':');
                    //ruleInfo[0] la min , ruleInfo[1] la 6
                    rule = ruleInfo[0];
                }

                var ruleFunc = validatorRules[rule];
                //chay function de lay gia tri min la 6, muc dich la get function(value) trong ham min 
                if(isRuleHasValue){
                    ruleFunc = ruleFunc(ruleInfo[1]);
                }


                //kiem tra formRules co la array hay khong va push rule vao formRules
                
                if(Array.isArray(formRules[input.name])){
                    formRules[input.name].push(ruleFunc)
                }

                else{
                    formRules[input.name] = [ruleFunc];
                }
            }          
        
            //Lắng nghe sự kiện để validate (blur,change)

            input.onblur = handleValidate;
            input.oninput = handleClearError;
            
            
            
            // hàm thực hiện validate
        function handleValidate(event){
            var rules = formRules[event.target.name];
            var errorMessage;

            for(var rule of rules){
                errorMessage = rule(event.target.value);
                if(errorMessage){
                    break;
                }
            }
           


            //nếu có lỗi hiện thị ra UI
            if(errorMessage){
            var formGroup = getParentGroup(event.target, '.form-group');

                if(formGroup){
                    formGroup.classList.add('invalid');
                    var formMessage = formGroup.querySelector('.form-message');
                    if(formMessage){
                        formMessage.innerText = errorMessage;
                    }
                }   
            }
            return !errorMessage;
        }

            // hàm thực hiện clear message error
            function handleClearError(event){
                var formGroup = getParentGroup(event.target, '.form-group');
                if(formGroup.classList.contains('invalid')){
                    formGroup.classList.remove('invalid');
                    var formMessage = formGroup.querySelector('.form-message');
                    if(formMessage){
                        formMessage.innerText = '';
                    }
                }

            }
        }             
        //xử lý hành vi mặc định
        formElement.onsubmit = function(event){
            event.preventDefault();


            
            var inputs = formElement.querySelectorAll('[name][rule]');
            var isValid = true;
            for(var input of inputs){
                if(!handleValidate({target: input})){
                    isValid = false;
                };
            }
            
            if(isValid){
                formElement.submit();
            }
               
            
        }
    }

    
}



