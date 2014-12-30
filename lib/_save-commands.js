

program
    .command('core')
    .action(function(){

        var prompts = [
            {
                type:'list',
                name:'application',
                message:'Codebase starting point?',
                choices:[{
                    name:'bank',
                    value:'blank',
                },{
                    name:'skeleton',
                    value:'skeleton',
                    default:true
                }]
            }
        ]
        api.prompt(prompts, function(answers){
            api.core(answers)
        })
    })

