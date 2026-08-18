/*
let idade = prompt("qual sua idade?");

if (idade >=18) {
    alert("Você é maior de idade!");
} else {
    alert("Você é menor de idade!");
}
let nota = 7;
if (nota < 5) {
    console . log("Reprovado.");
}else if (nota < 7) {
    console . log("Recuperação.");
}else {
    console . log("Aprovado")
}
let nota1 = prompt("Digite a primeira nota: ");
let nota2 = prompt("Digite a segunda nota: ");
let nota3 = prompt("Digite a terceira nota: ");

let media = (parseFloat(nota1) + parseFloat(nota2) + parseFloat(nota3)) / 3;

if (media >= 7) {
    alert("Parabéns! Você foi aprovado com média: " + media.toFixed(2));
}else if (media >= 5) {
    alert("Você está de recuperação com média: " + media.toFixed(2));
}else {
    alert("Você foi reprovado com média: " + media.toFixed(2));
}
*/
function classificarIdade(idade){
if (idade < 12) {

    return "Criança"

} else if (idade < 18) {

    return "Adolescente";

} else  if (idade < 60){

    return "Adulto";

 } else { 

    return "Idoso";
 }
}

function iniciarClassificação() {

    let idade = Number(prompt("Digite sua idade"));

    let resultado = classificarIdade(idade);

    alert("Sua classificação é: " + resultado);
}