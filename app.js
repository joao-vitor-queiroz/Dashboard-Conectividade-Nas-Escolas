var APP_ID   = "njYUczxm23exrhaC6qIrF6QjfKQJBvSKANZCEpii";
var REST_KEY = "REFq6aHHKkv7Z43b8JNMXuFaTcZqN2qlxCHxDe9B";
var URL_BASE = "https://parseapi.back4app.com/classes/Escolas";
var HEADERS  = {
  "X-Parse-Application-Id": APP_ID,
  "X-Parse-REST-API-Key": REST_KEY,
  "Content-Type": "application/json"
};

var lista = [];

async function b4aGet() {
  var resposta = await fetch(URL_BASE + "?limit=100", { headers: HEADERS });
  var dados = await resposta.json();
  return dados.results || [];
}

async function b4aPost(obj) {
  var resposta = await fetch(URL_BASE, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(obj)
  });
  return await resposta.json();
}

async function b4aPut(id, obj) {
  var resposta = await fetch(URL_BASE + "/" + id, {
    method: "PUT",
    headers: HEADERS,
    body: JSON.stringify(obj)
  });
  return await resposta.json();
}

async function b4aDelete(id) {
  var resposta = await fetch(URL_BASE + "/" + id, {
    method: "DELETE",
    headers: HEADERS
  });
  return await resposta.json();
}

window.onload = function() {
  carregar();
};

async function carregar() {
  document.getElementById("corpo-tabela").innerHTML = "<tr><td colspan='7'>Carregando...</td></tr>";
  lista = await b4aGet();
  atualizar();
}

function atualizar() {
  var total   = lista.length;
  var comNet  = 0;
  var semNet  = 0;
  var comLab  = 0;
  var alunos  = 0;

  for (var i = 0; i < lista.length; i++) {
    var escola = lista[i];
    if (escola.internet === true)    comNet++;
    if (escola.internet === false)   semNet++;
    if (escola.laboratorio === true) comLab++;
    alunos += escola.qtdAlunos || 0;
  }

  document.getElementById("total-escolas").textContent      = total;
  document.getElementById("total-internet").textContent     = comNet;
  document.getElementById("total-sem-internet").textContent = semNet;
  document.getElementById("total-lab").textContent          = comLab;
  document.getElementById("total-alunos").textContent       = alunos;

  renderTabela(lista);
  desenharGraficos(lista);
}

function renderTabela(escolas) {
  var corpo = document.getElementById("corpo-tabela");

  if (escolas.length === 0) {
    corpo.innerHTML = "<tr><td colspan='7' style='text-align:center;color:#888'>Nenhuma escola encontrada.</td></tr>";
    return;
  }

  var linhas = "";
  for (var i = 0; i < escolas.length; i++) {
    var e = escolas[i];
    var nome = e.nome || "Sem nome";
    linhas += "<tr>";
    linhas += "<td>" + nome + "</td>";
    linhas += "<td>" + (e.qtdAlunos || 0) + "</td>";
    linhas += "<td>" + badge(e.internet) + "</td>";
    linhas += "<td>" + badge(e.laboratorio) + "</td>";
    linhas += "<td>" + (e.cep || "—") + "</td>";
    linhas += "<td>" + (e.endereco || "—") + "</td>";
    linhas += "<td>";
    linhas += "<button class='btn-editar' onclick='editar(\"" + e.objectId + "\")'>Editar</button>";
    linhas += "<button class='btn-excluir' onclick='excluir(\"" + e.objectId + "\",\"" + nome.replace(/"/g, "") + "\")'>Excluir</button>";
    linhas += "</td></tr>";
  }

  corpo.innerHTML = linhas;
}

function badge(valor) {
  if (valor) {
    return "<span class='badge-sim'>Sim</span>";
  } else {
    return "<span class='badge-nao'>Não</span>";
  }
}

function buscarEscola() {
  var busca = document.getElementById("campo-busca").value.toLowerCase();
  var resultado = lista.filter(function(e) {
    return e.nome.toLowerCase().includes(busca);
  });
  renderTabela(resultado);
}

function editar(id) {
  var escola = lista.find(function(e) { return e.objectId === id; });

  document.getElementById("campo-id").value       = escola.objectId;
  document.getElementById("campo-nome").value     = escola.nome;
  document.getElementById("campo-alunos").value   = escola.qtdAlunos || 0;
  document.getElementById("campo-internet").value = escola.internet ? "true" : "false";
  document.getElementById("campo-lab").value      = escola.laboratorio ? "true" : "false";
  document.getElementById("campo-cep").value      = escola.cep || "";

  if (escola.endereco) {
    document.getElementById("campo-endereco").value = escola.endereco;
    document.getElementById("linha-endereco").style.display = "block";
  }

  document.getElementById("titulo-form").textContent = "Editar Escola";
  document.getElementById("form-escola").scrollIntoView({ behavior: "smooth" });
}

async function excluir(id, nome) {
  if (!confirm("Excluir \"" + nome + "\"?")) return;
  await b4aDelete(id);
  lista = lista.filter(function(e) { return e.objectId !== id; });
  atualizar();
}

async function salvarEscola() {
  var id   = document.getElementById("campo-id").value;
  var nome = document.getElementById("campo-nome").value.trim();

  if (!nome) {
    msg("msg-form", "Preencha o nome da escola!", "red");
    return;
  }

  var obj = {
    nome:        nome,
    qtdAlunos:   parseInt(document.getElementById("campo-alunos").value) || 0,
    internet:    document.getElementById("campo-internet").value === "true",
    laboratorio: document.getElementById("campo-lab").value === "true",
    cep:         parseInt(document.getElementById("campo-cep").value.replace(/\D/g, "")) || 0,
    endereco:    document.getElementById("campo-endereco").value
  };

  if (id) {
    await b4aPut(id, obj);
    msg("msg-form", "Escola atualizada!", "green");
  } else {
    await b4aPost(obj);
    msg("msg-form", "Escola cadastrada!", "green");
  }
  limparForm();
  carregar();
}

function limparForm() {
  document.getElementById("campo-id").value      = "";
  document.getElementById("campo-nome").value    = "";
  document.getElementById("campo-alunos").value  = "";
  document.getElementById("campo-cep").value     = "";
  document.getElementById("campo-endereco").value = "";
  document.getElementById("campo-internet").value = "true";
  document.getElementById("campo-lab").value      = "true";
  document.getElementById("linha-endereco").style.display = "none";
  document.getElementById("titulo-form").textContent = "Cadastrar Nova Escola";
  document.getElementById("msg-form").textContent = "";
  document.getElementById("msg-cep").textContent  = "";
}

function msg(id, texto, cor) {
  var el = document.getElementById(id);
  el.textContent = texto;
  el.style.color = cor;
}

async function buscarCEP() {
  var cep = document.getElementById("campo-cep").value.replace(/\D/g, "");
  if (cep.length !== 8) {
    msg("msg-cep", "CEP inválido! Digite 8 números.", "red");
    return;
  }
  msg("msg-cep", "Buscando...", "#555");
  try {
    var resposta = await fetch("https://viacep.com.br/ws/" + cep + "/json/");
    var dados = await resposta.json();
    if (dados.erro) {
      msg("msg-cep", "CEP não encontrado.", "red");
      return;
    }

    var endereco = dados.logradouro + ", " + dados.bairro + " - " + dados.localidade + "/" + dados.uf;
    document.getElementById("campo-endereco").value = endereco;
    document.getElementById("linha-endereco").style.display = "block";
    msg("msg-cep", "", "");
  } catch (erro) {
    msg("msg-cep", "Erro ao buscar o CEP.", "red");
  }
}