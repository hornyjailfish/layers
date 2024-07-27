let SessionLoad = 1
let s:so_save = &g:so | let s:siso_save = &g:siso | setg so=0 siso=0 | setl so=-1 siso=-1
let v:this_session=expand("<sfile>:p")
silent only
silent tabonly
cd ~/gits/layers
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
let s:shortmess_save = &shortmess
if &shortmess =~ 'A'
  set shortmess=aoOA
else
  set shortmess=aoO
endif
badd +242 src/create_map.js
badd +147 src/map.js
badd +19 src/index.html
badd +22 ~/gits/test-map/src/controls.js
badd +28 deno.json
badd +1 static/-1shops.geojson
badd +8 static/1walls.geojson
badd +12 static/-1w.geojson
badd +28 ~/gits/test-map/db.ts
badd +1 ~/gits/test-map/static/-1sh.json
badd +1 ~/gits/layers/static/-1sh.json
badd +1 ~/gits/layers/static/-1walls.geojson
badd +11 db.ts
badd +1 ~/gits/layers/src/surreal.js
badd +7 static/2shops.geojson
badd +64 ~/gits/layers/history.txt
badd +1 ~/gits/layers/main.js
badd +1 static/1shops.geojson
argglobal
%argdel
edit src/create_map.js
argglobal
balt ~/gits/layers/src/surreal.js
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let &fdl = &fdl
let s:l = 242 - ((17 * winheight(0) + 15) / 30)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 242
normal! 0
tabnext 1
if exists('s:wipebuf') && len(win_findbuf(s:wipebuf)) == 0 && getbufvar(s:wipebuf, '&buftype') isnot# 'terminal'
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20
let &shortmess = s:shortmess_save
let s:sx = expand("<sfile>:p:r")."x.vim"
if filereadable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &g:so = s:so_save | let &g:siso = s:siso_save
set hlsearch
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
