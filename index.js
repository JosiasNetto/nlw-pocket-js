const  { select, input }  = require('@inquirer/prompts')

let metas = []

const cadastrar_meta = async () => {
  const meta = await input({message: "Digite a meta:"})

  if(!meta.length) {
    console.log("A meta não pode ser vazia")
    return
  }

  metas.push({value: meta, checked: false})

}

const start = async () => {

  while(true){

    const opcao = await select({
      message: "Menu >",
      choices: [
        {
          name: "Cadastrar meta",
          value: "cadastrar"
        },
        {
          name: "Listar metas",
          value: "listar"
        },
        {
          name:"Sair",
          value:"sair"
        }
      ]
    })

    switch(opcao){
      case "cadastrar":
        await cadastrar_meta()
        console.log(metas)
        break
      case "listar":
        console.log("vamos listar")
        break
      case "sair":
        console.log("Ate a proxima!")
        return
    }
  }
}

start() 