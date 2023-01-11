$(function () {

    $('#btn-login').on('click', function (e) {
 
        var form = $('#form')[0];
        var form_data = new FormData(form); 
        if($('#isStudent').is(":checked")){
            form_data.append('tableName', 'etudiant');
        }else {
            form_data.append('tableName', 'professeur');
        }
        
        console.log('check');

        $.ajax({
            url: "/auth",
            method: "POST", 
            data: form_data,
            contentType: false,
            processData: false,
            success: (data)=>{ 
                // if(data =='Success'){
                     
                // }
                location.reload(true);
            }
        });
    })
    
})