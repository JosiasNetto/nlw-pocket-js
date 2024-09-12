const  { select, input, checkbox }  = require('@inquirer/prompts')

let metas = []

const cadastrar_meta = async () => {
  const meta = await input({message: "Digite a meta:"})

  if(!meta.length) {
    console.log("A meta não pode ser vazia")
    return
  }

  metas.push({value: meta, checked: false})

}

const listar_metas = async () => {
  const respostas = await checkbox({
    message: "Use as setas para mudar de meta, o Espaço para marcar ou desmarcar e o Enter para finalizar essa etapa",
    choices: [...metas],
    instructions: false
  })

  metas.forEach((m) => {
    m.checked = false
  })
  
  if(!respostas.length) {
    console.log("Nenhuma meta selecionada!")
    return
  }

  
  respostas.forEach((resposta) => {
    const meta = metas.find((m) => {
      return m.value == resposta
    })

    meta.checked = true

  })

  console.log("Meta(s) marcada(s) como concluida(s)")
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
        await listar_metas()
        break
      case "sair":
        console.log("Ate a proxima!")
        return
    }
  }
}

start() 