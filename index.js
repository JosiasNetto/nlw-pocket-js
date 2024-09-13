//Desestruturando e adcionando funções diretamente ao codigo
const  { select, input, checkbox }  = require('@inquirer/prompts')
const fs = require('fs').promises

let mensagem = "Bem vindo ao App de metas"

//Declarando lista de metas
let metas

const carregar_metas = async () => {
    try{
        const dados = await fs.readFile("metas.json", "utf-8")
        metas = JSON.parse(dados)
    }
    catch(erro){
        metas = []
    }
}

const salvar_metas = async () => {
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2))
}


//Funcao assincrona que criar uma meta
const cadastrar_meta = async () => {
  const meta = await input({message: "Digite a meta:"}) //Recebe a meta do usuario

  if(!meta.length) {  //Verifica se algo foi digitado
    mensagem = "A meta não pode ser vazia"
    return //Caso n tenha sido, retorna para a aba de opcoes
  }

  metas.push({value: meta, checked: false}) //Adciona o objeto da meta a lista de metas

  mensagem = "Meta cadastrada com sucesso!"

}

const listar_metas = async () => {  //Funcao assincrona que lista as metas existentes
  //Declara a lista de respostas com as metas marcadas pelo usuario no checkbox de metas
  if(metas.length == 0) {
    mensagem = "Você não cadastrou nenhuma meta"
    return
  }
  const respostas = await checkbox({  
    message: "Use as setas para mudar de meta, o Espaço para marcar ou desmarcar e o Enter para finalizar essa etapa",
    choices: [...metas],
    instructions: false
  })

  metas.forEach((m) => {  //Declara todas as metas como n realizadas
    m.checked = false
  })
  
  if(!respostas.length) { //Verifica se existe alguma meta marcada
    mensagem = "Nenhuma meta selecionada!"
    return
  }

  
  respostas.forEach((resposta) => { //Para cada resposta, a procura na lista de metas e a marca como feita
    const meta = metas.find((m) => {
      return m.value == resposta
    })

    meta.checked = true

  })

 
  mensagem = "Meta(s) marcada(s) como concluida(s)" //Msg de que as metas foram marcadas
  
}

const metas_realizadas = async () => {
    const realizadas = metas.filter((meta) => {
        return meta.checked
    })

    if(!realizadas.length){
        mensagem = "Não existem metas realizadas"
        return
    }

    await select({
        message: "Metas Realizadas: " + realizadas.length,
        choices: [...realizadas]
    })
}

const metas_abertas = async () => {
    const abertas = metas.filter((meta) => {
        return !meta.checked
    })

    if(abertas.length == 0){
        mensagem = "Não existem metas abertas!:)"
        return
    }

    await select({
        message: "Metas abertas: " + abertas.length,
        choices: [...abertas]
    })
}

const deletar_metas = async () => {

    if(metas.length == 0) {
        mensagem = "Você não cadastrou nenhuma meta para deletar"
        return
      }

    const metasDesmarcadas = metas.map((meta) =>{
        return {value: meta.value, checked: false}
    })

    const itemsADeletar = await checkbox({  
        message: "Selecione item para deletar",
        choices: [...metasDesmarcadas],
        instructions: false
      })

    if(itemsADeletar.length == 0){
        mensagem = "Nenhum item para deletar"
        return
    }

    itemsADeletar.forEach((item) => {
        metas = metas.filter((meta) => {
            return meta.value != item
        })
    })

    mensagem = "Meta(s) deletada(s) com sucesso!"
}

const mostrar_mensagem = () => {
    console.clear()

    if(mensagem != ""){
        console.log(mensagem)
        console.log("")
        mensagem = ""
    }
}

const start = async () => { //Funcao que inicia o app
    
    await carregar_metas()
   

  while(true){
    await salvar_metas()
    mostrar_mensagem()

    const opcao = await select({  //Declara a opcao do usuario por meio da funcao select
      message: "Menu >",  //Mensagem que aparece no topo
      choices: [  //Lista que guarda as opcoes e seus valores 
        {
          name: "Cadastrar meta",
          value: "cadastrar"
        },
        {
          name: "Listar metas",
          value: "listar"
        },
        {
          name: "Metas realizadas",
          value: "realizadas"
        },
        {
          name: "Metas abertas",
          value: "abertas"
        },
        {
          name: "Deletar metas",
          value: "deletar"
        },
        {
          name:"Sair",
          value:"sair"
        }
      ]
    })

    switch(opcao){  //Verifica a opcao do usuario, e executa o seu caso
      case "cadastrar":
        await cadastrar_meta()
        console.log(metas)
        break
      case "listar":
        await listar_metas()
        break
      case "realizadas":
        await metas_realizadas()
        break
      case "abertas":
        await metas_abertas()
        break
      case "deletar":
        await deletar_metas()
        break
      case "sair":
        console.log("Ate a proxima!")
        return
    }
  }
}

start() 