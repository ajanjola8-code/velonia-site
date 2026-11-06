const http = require('http');
const users = { 'admin': '1234' };

const html = `<!DOCTYPE html><html><head><title>Velonia</title>
<link href="https://googleapis.com" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0;font-family:'Plus Jakarta Sans',sans-serif}
body{background:#111214;color:#fff}
.nav{background:#191b1d;height:44px;display:flex;align-items:center;padding:0 18px;border-bottom:1px solid #2b2d2f}
.brand{font-family:'Montserrat',sans-serif;font-weight:900;font-size:20px;color:#fff;text-decoration:none;display:flex;align-items:center;margin-right:24px}
.o{display:inline-block;width:14px;height:14px;border:4px solid #fff;transform:rotate(15deg);margin:0 2px}
.links{display:flex;gap:20px;font-size:14px;font-weight:600;color:#bdbebe}
.wrap{min-height:92vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px}
.logo{font-family:'Montserrat',sans-serif;font-weight:900;font-size:36px;margin-bottom:20px;display:flex;align-items:center}
.logo .o{width:26px;height:26px;border-width:7px;margin:0 3px}
.box{background:#191b1d;width:100%;max-width:380px;padding:26px;border-radius:12px;border:1px solid #2b2d2f}
.in{width:100%;background:#111214;border:1px solid #393b3d;color:#fff;padding:10px;border-radius:8px;margin:6px 0 14px;outline:none}
.btn{width:100%;background:#335fff;color:#fff;border:none;padding:12px;border-radius:8px;font-weight:700;cursor:pointer}
.alt{width:100%;background:#232527;color:#fff;border:1px solid #393b3d;padding:10px;border-radius:8px;margin-top:10px;cursor:pointer}
.hide{display:none!important}
.layout{display:flex;min-height:calc(100vh - 44px)}
.side{width:175px;background:#191b1d;padding:10px 6px;border-right:1px solid #232527}
.side p{padding:8px 12px;border-radius:4px;cursor:pointer;font-size:14px;color:#fff;margin-bottom:2px}
.side p:hover,.side p.act{background:#232527}
.main{flex:1;padding:28px 40px;max-width:950px}
.head{display:flex;align-items:center;gap:18px;margin-bottom:28px}
.av{width:85px;height:85px;border-radius:50%;background:#232527;border:1px solid #393b3d;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:bold}
.sec{font-size:18px;font-weight:700;border-bottom:1px solid #2b2d2f;padding-bottom:8px;margin:20px 0 12px}
.empty{background:#191b1d;border:1px solid #2b2d2f;border-radius:6px;padding:35px;text-align:center;color:#bdbebe;font-size:14px}
</style></head><body>

<div class="nav">
    <a href="#" class="brand">VEL<span class="o"></span>NIA</a>
    <div class="links"><span>Games</span><span>Avatar Shop</span><span>Create</span><span>Robux</span></div>
    <span style="margin-left:auto;font-weight:700;margin-right:16px">490 R$</span>
    <span id="nu">Guest</span>
</div>

<div class="wrap" id="auth">
    <div class="logo">VEL<span class="o"></span>NIA</div>
    <div class="box" id="l-box">
        <h2 style="margin-bottom:14px">Sign in</h2>
        <label style="font-size:13px">Username</label>
        <input class="in" id="lu" placeholder="Username">
        <label style="font-size:13px">Password</label>
        <input class="in" type="password" id="lp" placeholder="Password">
        <button class="btn" onclick="go('/login')">Sign in</button>
        <button class="alt" onclick="sw()">Create account</button>
    </div>
    <div class="box hide" id="r-box">
        <h2 style="margin-bottom:14px">Create account</h2>
        <label style="font-size:13px">Birthday</label>
        <input class="in" type="date">
        <label style="font-size:13px">Username</label>
        <input class="in" id="ru" placeholder="Don't use your real name">
        <label style="font-size:13px">Password</label>
        <input class="in" type="password" id="rp" placeholder="At least 8 characters">
        <button class="btn" onclick="go('/signup')">Continue</button>
        <button class="alt" onclick="sw()">Already have an account? Sign in</button>
    </div>
</div>

<div class="layout hide" id="home">
    <div class="side">
        <p class="act">Home</p><p>Profile</p><p>Messages</p><p>Friends</p><p>Avatar</p><p>Inventory</p><p>Groups</p>
        <p onclick="location.reload()" style="color:#ff5555;margin-top:14px">Log Out</p>
    </div>
    <div class="main">
        <div class="head"><div class="av" id="av">?</div><h2 id="wn">User</h2></div>
        <div class="sec">Recent</div>
        <div class="empty">No games yet</div>
    </div>
</div>

<script>
let isL=true;
function sw(){isL=!isL;document.getElementById('l-box').classList.toggle('hide',!isL);document.getElementById('r-box').classList.toggle('hide',isL);}
async function go(ep){
    const u=document.getElementById(isL?'lu':'ru').value,p=document.getElementById(isL?'lp':'rp').value;
    const r=await fetch(ep,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:u,password:p})});
    const d=await r.json();
    if(d.ok){
        document.getElementById('auth').classList.add('hide');
        document.getElementById('home').classList.remove('hide');
        document.getElementById('nu').innerText=u;
        document.getElementById('wn').innerText=u;
        document.getElementById('av').innerText=u.slice(0,2).toUpperCase();
    }else alert(d.msg);
}
</script></body></html>`;

http.createServer((req,res)=>{
    if(req.method==='POST'){
        let b='';req.on('data',c=>b+=c);req.on('end',()=>{
            const {username,password}=JSON.parse(b);
            res.writeHead(200,{'Content-Type':'application/json'});
            if(!username||!password)return res.end(JSON.stringify({ok:false,msg:'Fill all fields!'}));
            if(req.url==='/signup'){
                if(users[username])return res.end(JSON.stringify({ok:false,msg:'Username taken!'}));
                users[username]=password;return res.end(JSON.stringify({ok:true}));
            }
            return res.end(JSON.stringify(users[username]===password?{ok:true}:{ok:false,msg:'Wrong login!'}));
        });
    }else{res.writeHead(200,{'Content-Type':'text/html'});res.end(html);}
}).listen(process.env.PORT || 80,()=>console.log('SUCCESS! Velonia live!'));
