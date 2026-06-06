@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600&family=Barlow:wght@400;500&display=swap');
:root{--sleep:#5BA4CF;--activity:#E63946;--nutrition:#52B788;--eval:#888888;--gold:#F4A261;--bg:#0D0D0D;--card:#1A1A1A;--header:#111111;--border:#2a2a2a;--text:#eeeeee;--muted:#888888;--dim:#333333;}
*{box-sizing:border-box;margin:0;padding:0;}
html,body,#root{height:100%;background:var(--bg);color:var(--text);font-family:'Barlow',sans-serif;-webkit-font-smoothing:antialiased;}
a{color:inherit;text-decoration:none;}
button{cursor:pointer;font-family:'Barlow',sans-serif;border:none;background:none;color:inherit;}
input{font-family:'Barlow',sans-serif;background:var(--card);border:1px solid var(--border);color:var(--text);border-radius:8px;padding:10px 14px;font-size:15px;width:100%;outline:none;transition:border-color .2s;}
input:focus{border-color:var(--muted);}
.app-shell{min-height:100%;display:flex;flex-direction:column;}
.page{flex:1;max-width:480px;width:100%;margin:0 auto;padding:0 0 100px;}
.nav-bar{position:fixed;bottom:0;left:0;right:0;background:var(--header);border-top:1px solid var(--border);display:flex;z-index:100;max-width:480px;margin:0 auto;}
.nav-bar a{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:10px 0 12px;font-family:'Barlow Condensed',sans-serif;font-size:10px;letter-spacing:1px;text-transform:uppercase;color:var(--muted);transition:color .15s;}
.nav-bar a.active{color:var(--gold);}
.nav-icon{font-size:18px;}
.top-bar{background:var(--header);padding:16px 20px 12px;border-bottom:1px solid var(--border);}
.top-bar h1{font-family:'Bebas Neue',sans-serif;font-size:28px;letter-spacing:3px;color:#fff;line-height:1;}
.top-bar .subtitle{font-family:'Barlow Condensed',sans-serif;font-size:11px;color:var(--muted);letter-spacing:1.5px;text-transform:uppercase;margin-top:3px;}
.score-ring-wrap{background:var(--card);padding:20px;display:flex;align-items:center;gap:20px;border-bottom:1px solid var(--border);}
.ring-container{position:relative;width:90px;height:90px;flex-shrink:0;}
.ring-container svg{width:100%;height:100%;transform:rotate(-90deg);}
.ring-bg{fill:none;stroke:var(--border);stroke-width:7;}
.ring-fill{fill:none;stroke-width:7;stroke-linecap:round;transition:stroke-dashoffset .5s ease,stroke .3s;}
.ring-label{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:'Bebas Neue',sans-serif;}
.ring-num{font-size:30px;line-height:1;color:#fff;}
.ring-denom{font-size:11px;color:var(--muted);letter-spacing:1px;}
.pillar-bars{flex:1;display:flex;flex-direction:column;gap:9px;}
.pillar-row{display:flex;align-items:center;gap:8px;}
.pillar-label{font-family:'Barlow Condensed',sans-serif;font-size:11px;letter-spacing:1px;text-transform:uppercase;width:62px;color:var(--muted);}
.bar-track{flex:1;height:5px;background:var(--border);border-radius:3px;overflow:hidden;}
.bar-fill{height:100%;border-radius:3px;transition:width .4s ease;}
.pillar-pts{font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:600;width:30px;text-align:right;}
.section-header{display:flex;align-items:center;gap:10px;padding:10px 20px 8px;border-bottom:1px solid var(--border);cursor:pointer;user-select:none;transition:background .15s;}
.section-header:active{background:rgba(255,255,255,0.03);}
.section-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
.section-title{font-family:'Bebas Neue',sans-serif;font-size:16px;letter-spacing:2px;flex:1;}
.section-score{font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:600;}
.section-chevron{font-size:12px;color:var(--muted);transition:transform .2s;}
.section-chevron.open{transform:rotate(180deg);}
.item-row{display:flex;align-items:center;padding:11px 20px;border-bottom:1px solid rgba(255,255,255,0.04);gap:12px;cursor:pointer;transition:background .12s;-webkit-tap-highlight-color:transparent;}
.item-row:active{background:rgba(255,255,255,0.04);}
.item-row:last-child{border-bottom:none;}
.item-label{flex:1;font-size:14px;color:#ccc;line-height:1.3;}
.item-label span{font-size:11px;color:var(--muted);display:block;margin-top:2px;font-family:'Barlow Condensed',sans-serif;letter-spacing:.5px;}
.item-pts-label{font-family:'Barlow Condensed',sans-serif;font-size:11px;color:var(--muted);min-width:28px;text-align:right;}
.checkbox{width:28px;height:28px;border-radius:8px;border:1.5px solid var(--dim);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background .15s,border-color .15s,transform .1s;}
.checkbox.checked{border-color:transparent;}
.checkbox.checked::after{content:'';width:10px;height:6px;border-left:2px solid #fff;border-bottom:2px solid #fff;transform:rotate(-45deg) translateY(-1px);}
.checkbox:active{transform:scale(0.9);}
.grade-badge{font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:1.5px;padding:5px 12px;border-radius:6px;border:1px solid transparent;transition:all .3s;}
.bottom-action{padding:14px 20px;background:var(--header);border-top:1px solid var(--border);display:flex;align-items:center;gap:10px;}
.btn-primary{background:#fff;color:#000;font-family:'Bebas Neue',sans-serif;font-size:16px;letter-spacing:2px;padding:12px 24px;border-radius:8px;width:100%;transition:opacity .15s,transform .1s;}
.btn-primary:active{opacity:.85;transform:scale(0.98);}
.btn-primary:disabled{opacity:.4;}
.btn-ghost{background:none;border:1px solid var(--dim);color:var(--muted);font-family:'Barlow Condensed',sans-serif;font-size:13px;letter-spacing:1px;text-transform:uppercase;padding:9px 16px;border-radius:8px;transition:all .15s;}
.btn-ghost:hover{border-color:var(--muted);color:var(--text);}
.history-wrap{padding:16px 20px;border-top:1px solid var(--border);}
.history-title{font-family:'Barlow Condensed',sans-serif;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);margin-bottom:10px;}
.history-dots{display:flex;gap:5px;}
.h-dot{flex:1;height:32px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:600;}
.h-dot.today{outline:1.5px solid var(--gold);}
.lb-row{display:flex;align-items:center;gap:12px;padding:12px 20px;border-bottom:1px solid rgba(255,255,255,0.05);transition:background .1s;}
.lb-row:last-child{border-bottom:none;}
.lb-rank{font-family:'Bebas Neue',sans-serif;font-size:20px;width:28px;text-align:center;color:var(--muted);}
.lb-rank.top{color:var(--gold);}
.lb-avatar{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue',sans-serif;font-size:14px;flex-shrink:0;}
.lb-name{flex:1;font-size:14px;font-weight:500;}
.lb-meta{font-size:11px;color:var(--muted);font-family:'Barlow Condensed',sans-serif;margin-top:1px;}
.lb-score{font-family:'Bebas Neue',sans-serif;font-size:22px;text-align:right;}
.lb-score span{font-size:11px;color:var(--muted);margin-left:2px;font-family:'Barlow Condensed',sans-serif;}
.dash-stat{flex:1;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:14px 16px;}
.dash-stat-label{font-family:'Barlow Condensed',sans-serif;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:var(--muted);margin-bottom:4px;}
.dash-stat-value{font-family:'Bebas Neue',sans-serif;font-size:28px;line-height:1;color:#fff;}
.auth-page{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;background:var(--bg);}
.auth-logo{font-family:'Bebas Neue',sans-serif;font-size:52px;letter-spacing:8px;color:#fff;margin-bottom:4px;}
.auth-tagline{font-family:'Barlow Condensed',sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-bottom:40px;}
.auth-card{width:100%;max-width:380px;background:var(--card);border:1px solid var(--border);border-radius:14px;padding:28px 24px;}
.auth-card h2{font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:2px;margin-bottom:20px;}
.form-group{margin-bottom:14px;}
.form-label{font-family:'Barlow Condensed',sans-serif;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:var(--muted);display:block;margin-bottom:6px;}
.auth-switch{text-align:center;margin-top:18px;font-size:13px;color:var(--muted);}
.auth-switch button{color:var(--gold);font-size:13px;text-decoration:underline;background:none;border:none;cursor:pointer;margin-left:4px;}
.error-msg{background:rgba(230,57,70,0.12);border:1px solid rgba(230,57,70,0.3);color:#E63946;border-radius:8px;padding:10px 14px;font-size:13px;margin-bottom:14px;}
.eval-note{padding:8px 20px 10px;font-size:11px;font-style:italic;font-family:'Barlow Condensed',sans-serif;letter-spacing:.5px;color:var(--muted);}
.tabs{display:flex;border-bottom:1px solid var(--border);}
.tab{flex:1;padding:12px 0;font-family:'Barlow Condensed',sans-serif;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);text-align:center;border-bottom:2px solid transparent;transition:all .15s;cursor:pointer;}
.tab.active{color:var(--gold);border-bottom-color:var(--gold);}
.loading-screen{min-height:100vh;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px;}
.loading-logo{font-family:'Bebas Neue',sans-serif;font-size:48px;letter-spacing:8px;color:#fff;opacity:.2;animation:pulse 1.5s ease-in-out infinite;}
@keyframes pulse{0%,100%{opacity:.15;}50%{opacity:.4;}}
.save-indicator{margin-left:auto;font-family:'Barlow Condensed',sans-serif;font-size:11px;letter-spacing:1px;color:var(--muted);display:flex;align-items:center;gap:5px;}
.save-dot{width:6px;height:6px;border-radius:50%;background:var(--nutrition);opacity:0;transition:opacity .3s;}
.save-dot.show{opacity:1;}
