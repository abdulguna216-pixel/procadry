'use strict';
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navigation');
function closeMenu() {menuButton.setAttribute('aria-expanded','false'); navigation.classList.remove('is-open');}
menuButton.addEventListener('click', () => {const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));navigation.classList.toggle('is-open',open);});
navigation.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menuButton.getAttribute('aria-expanded')==='true'){closeMenu();menuButton.focus();}});
document.addEventListener('click',event=>{if(!event.target.closest('.header'))closeMenu();});
document.querySelectorAll('.faq-item button').forEach(button=>button.addEventListener('click',()=>{const expanded=button.getAttribute('aria-expanded')==='true';button.setAttribute('aria-expanded',String(!expanded));document.getElementById(button.getAttribute('aria-controls')).hidden=expanded;button.querySelector('.plus').textContent=expanded?'+':'−';}));

document.querySelectorAll('.service-trigger').forEach(trigger => {
  const dialog = document.getElementById(trigger.getAttribute('aria-controls'));
  trigger.addEventListener('click', () => dialog.showModal());
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  let pressedOutside = false;
  dialog.addEventListener('pointerdown', event => {
    pressedOutside = event.target === dialog;
  });
  dialog.addEventListener('click', event => {
    if (pressedOutside && event.target === dialog) dialog.close();
    pressedOutside = false;
  });
  dialog.addEventListener('close', () => {
    pressedOutside = false;
    trigger.focus({preventScroll:true});
  });
});
