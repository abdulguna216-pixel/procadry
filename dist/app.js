'use strict';
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navigation');
function closeMenu() {menuButton.setAttribute('aria-expanded','false'); navigation.classList.remove('is-open');}
menuButton.addEventListener('click', () => {const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));navigation.classList.toggle('is-open',open);});
navigation.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menuButton.getAttribute('aria-expanded')==='true'){closeMenu();menuButton.focus();}});
document.addEventListener('click',event=>{if(!event.target.closest('.header'))closeMenu();});
document.querySelectorAll('[data-service]').forEach(link=>link.addEventListener('click',()=>{document.querySelector('#service').value=link.dataset.service;}));
document.querySelectorAll('.faq-item button').forEach(button=>button.addEventListener('click',()=>{const expanded=button.getAttribute('aria-expanded')==='true';button.setAttribute('aria-expanded',String(!expanded));document.getElementById(button.getAttribute('aria-controls')).hidden=expanded;button.querySelector('.plus').textContent=expanded?'+':'−';}));
const form = document.querySelector('#request-form');
const status = document.querySelector('.form-status');
function validateField(input) {
  let message='';
  if(input.name==='name'&&input.value.trim().length<2)message='Укажите имя — минимум 2 символа.';
  if(input.name==='phone') {const digits=input.value.replace(/\D/g,'');if(digits.length<10||digits.length>15||!/^[+\d\s()\-]+$/.test(input.value))message='Укажите телефон: от 10 до 15 цифр.';}
  if(input.name==='consent'&&!input.checked)message='Для отправки необходимо согласие.';
  document.getElementById(input.id+'-error').textContent=message;
  input.setAttribute('aria-invalid',String(Boolean(message)));
  return !message;
}
['name','phone','consent'].forEach(id=>{const input=document.getElementById(id);input.addEventListener(input.type==='checkbox'?'change':'input',()=>{if(input.hasAttribute('aria-invalid'))validateField(input);status.hidden=true;});});
form.addEventListener('submit',event=>{
  event.preventDefault();
  const fields=['name','phone','consent'].map(id=>document.getElementById(id));
  const valid=fields.map(validateField).every(Boolean);
  status.hidden=true;
  if(!valid){fields.find(field=>field.getAttribute('aria-invalid')==='true').focus();return;}
  // TODO: подключить подтверждённый обработчик CRM. Не сохраняем и не отправляем персональные данные до подключения.
  status.textContent='Приём заявок ещё не подключён. Данные не отправлены. Пожалуйста, вернитесь позже.';
  status.hidden=false;
});
