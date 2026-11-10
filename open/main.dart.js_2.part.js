((a,b)=>{a[b]=a[b]||{}})(self,"$__dart_deferred_initializers__")
$__dart_deferred_initializers__.current=function(a,b,c,$){var J,A,C,B={pT:function pT(d,e){this.a=d
this.b=e},uD:function uD(d,e){this.a=d
this.b=e},vV:function vV(d,e){this.a=d
this.b=e},Ew:function Ew(d,e,f,g,h,i,j){var _=this
_.r=d
_.y=e
_.Q=f
_.c=g
_.d=h
_.e=i
_.a=j},a6V:function a6V(d,e){var _=this
_.fx=_.fr=_.dy=_.dx=_.db=_.cy=_.cx=_.CW=null
_.e=_.d=$
_.dn$=d
_.bn$=e
_.c=_.a=null},aKg:function aKg(){},aKh:function aKh(){},aKi:function aKi(){},aKj:function aKj(){},aKk:function aKk(){},aKl:function aKl(){},aKm:function aKm(){},aKn:function aKn(){},uZ:function uZ(d,e){this.c=d
this.a=e},NF:function NF(){var _=this
_.f=_.e=_.d=$
_.c=_.a=null},aPo:function aPo(d,e){this.a=d
this.b=e},aPn:function aPn(d){this.a=d},I6:function I6(d,e){this.a=d
this.b=e},pm:function pm(d,e,f){var _=this
_.a=d
_.b=1
_.d=e
_.e=null
_.f=!0
_.P$=0
_.a8$=f
_.b3$=_.b0$=0},aID:function aID(d){this.a=d},
Cy(d){return B.bwe(d)},
bwe(a7){var w=0,v=A.u(x.Q),u,t=2,s=[],r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,a0,a1,a2,a3,a4,a5,a6
var $async$Cy=A.v(function(a8,a9){if(a8===1){s.push(a9)
w=t}for(;;)switch(w){case 0:t=4
f=$.db
r=f==null?$.db=new A.eB(200,1,"https://qcwotewlno9.rj2345.com",!1,180):f
q=A.b7($.hY+"/ShortMovie/ShortMovieList",0,null)
e=x.N
a2=A
a3="authorization"
a4="Bearer null"
a5="application/json, text/plain, */*"
a6="x-auth-uuid"
w=7
return A.l(A.km(),$async$Cy)
case 7:p=a2.F([a3,a4,"Accept",a5,a6,a9,"content-type",y.h],e,e)
J.cK(p,C.cT)
o=A.ur(C.v.cQ(a7))
e=$.cq
if(e==null)e=$.cq=new A.cG(A.a([],x.O))
w=8
return A.l(e.el("POST",q,p,o,null).bI(0,C.Q),$async$Cy)
case 8:n=a9
if(n.b===200){e=n
m=A.c1(A.c0(e.e)).a6(0,e.w)
l=A.hP(m)
k=C.v.a6(0,l)
k=k
d=k==null?null:J.w(J.w(k,"data"),"items")
j=d==null?[]:d
i=x.j.a(j)
for(e=J.bn(i);e.u();){h=e.gS(e)
J.ak(h,"link",A.us(r.c,J.w(J.w(h,"first"),"playUrl")))
J.ak(h,"contentType",C.k3)
J.ak(h,"needJiemi",!0)
J.ak(h,"playUrl",J.w(J.w(h,"first"),"playUrl"))
J.ak(h,"coverUrl",r.c+A.k(J.w(h,"imgUrl")))}if(J.dP(i)){e=A.a([],x.M)
u=e
w=1
break}else{e=A.vw(i,0,x.z)
e=A.iw(e,new B.aIb(),A.A(e).i("z.E"),x.E)
e=A.a3(e,A.A(e).i("z.E"))
u=e
w=1
break}}else{e=A.ac("HTTP \u9519\u8bef: "+n.b)
throw A.d(e)}t=2
w=6
break
case 4:t=3
a1=s.pop()
g=A.M(a1)
e=A.ac("\u83b7\u53d6drama\u5931\u8d25: "+A.k(g))
throw A.d(e)
w=6
break
case 3:w=2
break
case 6:case 1:return A.r(u,v)
case 2:return A.q(s.at(-1),v)}})
return A.t($async$Cy,v)},
bwa(){return"/xj-play"},
a4K(d){return B.bwi(d)},
bwi(a6){var w=0,v=A.u(x.Q),u,t=2,s=[],r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,a0,a1,a2,a3,a4,a5
var $async$a4K=A.v(function(a7,a8){if(a7===1){s.push(a8)
w=t}for(;;)switch(w){case 0:t=4
if($.db==null)$.db=new A.eB(200,1,"https://qcwotewlno9.rj2345.com",!1,180)
r=A.b7($.hY+"/ShortMovie/ShortMovieDetail",0,null)
f=x.N
a1=A
a2="authorization"
a3="Bearer null"
a4="application/json, text/plain, */*"
a5="x-auth-uuid"
w=7
return A.l(A.km(),$async$a4K)
case 7:q=a1.F([a2,a3,"Accept",a4,a5,a8,"content-type",y.h],f,f)
J.cK(q,C.cT)
p=A.ur(C.v.cQ(A.F(["Id",a6],f,f)))
f=$.cq
if(f==null)f=$.cq=new A.cG(A.a([],x.O))
w=8
return A.l(f.el("POST",r,q,p,null).bI(0,C.Q),$async$a4K)
case 8:o=a8
if(o.b===200){f=o
n=A.c1(A.c0(f.e)).a6(0,f.w)
m=A.hP(n)
l=C.v.a6(0,m)
f=l
e=f==null?null:J.w(J.w(f,"data"),"items")
k=e==null?[]:e
j=x.j.a(k)
for(i=0;i<J.aX(j);++i){h=J.w(j,i)
J.ak(h,"link",A.us(B.bwa(),J.w(h,"playUrl")))
f=l
f=f==null?null:J.w(J.w(f,"data"),"title")
J.ak(h,"title",f)
J.ak(h,"contentType",C.i6)
J.ak(h,"needJiemi",!0)
f=l
f=f==null?null:J.w(J.w(f,"data"),"episodeCount")
J.ak(h,"episodeCount",f)}if(J.dP(j)){f=A.a([],x.M)
u=f
w=1
break}else{f=A.vw(j,0,x.z)
f=A.iw(f,new B.aIm(),A.A(f).i("z.E"),x.E)
f=A.a3(f,A.A(f).i("z.E"))
u=f
w=1
break}}else{f=A.ac("\u83b7\u53d6drama\u8be6\u60c5HTTP \u9519\u8bef: "+o.b)
throw A.d(f)}t=2
w=6
break
case 4:t=3
a0=s.pop()
g=A.M(a0)
f=A.ac("\u83b7\u53d6drama\u8be6\u60c5\u5931\u8d25: "+A.k(g))
throw A.d(f)
w=6
break
case 3:w=2
break
case 6:case 1:return A.r(u,v)
case 2:return A.q(s.at(-1),v)}})
return A.t($async$a4K,v)},
aIu(d){return B.bwq(d)},
bwq(d){var w=0,v=A.u(x.y),u,t=2,s=[],r,q,p,o
var $async$aIu=A.v(function(e,f){if(e===1){s.push(f)
w=t}for(;;)switch(w){case 0:t=4
q=$.cq
if(q==null)q=$.cq=new A.cG(A.a([],x.O))
w=7
return A.l(q.fJ("HEAD",A.b7(d,0,null),null).bI(0,C.tX),$async$aIu)
case 7:r=f
A.bhe("Instance of '"+A.Jj(r)+"'")
q=r.b
u=q===200
w=1
break
t=2
w=6
break
case 4:t=3
o=s.pop()
u=!1
w=1
break
w=6
break
case 3:w=2
break
case 6:case 1:return A.r(u,v)
case 2:return A.q(s.at(-1),v)}})
return A.t($async$aIu,v)},
aIb:function aIb(){},
aIm:function aIm(){},
zG:function zG(d,e,f,g,h){var _=this
_.c=d
_.d=e
_.e=f
_.f=g
_.a=h},
aq8:function aq8(d){this.a=d},
aq9:function aq9(d){this.a=d},
aq7:function aq7(d,e){this.a=d
this.b=e},
BM:function BM(d,e,f,g){var _=this
_.c=d
_.d=e
_.r=f
_.a=g},
x3:function x3(d,e,f){var _=this
_.d=d
_.e=0
_.r=e
_.w=f
_.c=_.a=_.x=null},
aF0:function aF0(d,e){this.a=d
this.b=e},
aF1:function aF1(d,e){this.a=d
this.b=e},
aF_:function aF_(d,e){this.a=d
this.b=e},
aEX:function aEX(d,e){this.a=d
this.b=e},
aEV:function aEV(d,e){this.a=d
this.b=e},
aEW:function aEW(d,e){this.a=d
this.b=e},
aFc:function aFc(d,e){this.a=d
this.b=e},
aFb:function aFb(d,e,f){this.a=d
this.b=e
this.c=f},
aFg:function aFg(d){this.a=d},
aF2:function aF2(d,e){this.a=d
this.b=e},
aF8:function aF8(d,e){this.a=d
this.b=e},
aFa:function aFa(d){this.a=d},
aF9:function aF9(d,e){this.a=d
this.b=e},
aFf:function aFf(d){this.a=d},
aFd:function aFd(d,e){this.a=d
this.b=e},
aFe:function aFe(d,e){this.a=d
this.b=e},
aEZ:function aEZ(d){this.a=d},
aEY:function aEY(){},
aF7:function aF7(d,e,f,g){var _=this
_.a=d
_.b=e
_.c=f
_.d=g},
aF3:function aF3(d,e){this.a=d
this.b=e},
aF4:function aF4(d,e){this.a=d
this.b=e},
aF5:function aF5(d){this.a=d},
aF6:function aF6(d){this.a=d},
be9(d,e,f,g,h,i,j,k,l,m,n){return new B.Mm(n,l,k,i,g,h,e)},
Mm:function Mm(d,e,f,g,h,i,j){var _=this
_.d=d
_.e=e
_.r=f
_.w=g
_.x=h
_.y=i
_.a=j},
pn:function pn(d,e,f){var _=this
_.d=null
_.f=_.e=!1
_.r=d
_.w=e
_.x=!1
_.z=_.y=1
_.as=_.Q=null
_.ax=_.at=!1
_.ay=null
_.fw$=f
_.c=_.a=null},
aIT:function aIT(d){this.a=d},
aIU:function aIU(d){this.a=d},
aIV:function aIV(d){this.a=d},
aIW:function aIW(d){this.a=d},
aIY:function aIY(d){this.a=d},
aIX:function aIX(d){this.a=d},
aJ4:function aJ4(d){this.a=d},
aJ3:function aJ3(){},
aIL:function aIL(d){this.a=d},
aIQ:function aIQ(d){this.a=d},
aIP:function aIP(d,e,f){this.a=d
this.b=e
this.c=f},
aIN:function aIN(d){this.a=d},
aIO:function aIO(d,e){this.a=d
this.b=e},
aIM:function aIM(d){this.a=d},
aIZ:function aIZ(){},
aJ2:function aJ2(d){this.a=d},
aJ1:function aJ1(d,e,f){this.a=d
this.b=e
this.c=f},
aJ0:function aJ0(d){this.a=d},
aJ_:function aJ_(d){this.a=d},
aIS:function aIS(d){this.a=d},
aIR:function aIR(d){this.a=d},
R6:function R6(){},
ag0:function ag0(){},
bcR(){var w=new Float64Array(4)
w[3]=1
return new B.oL(w)},
oL:function oL(d){this.a=d}},D
J=c[1]
A=c[0]
C=c[2]
B=a.updateHolder(c[8],B)
D=c[12]
B.pT.prototype={
fA(d){return A.ut(this.a,this.b,d)}}
B.uD.prototype={
fA(d){var w=A.jH(this.a,this.b,d)
w.toString
return w}}
B.vV.prototype={
fA(a9){var w,v,u,t,s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,a0,a1,a2,a3=new A.cD(new Float64Array(3)),a4=new A.cD(new Float64Array(3)),a5=B.bcR(),a6=B.bcR(),a7=new A.cD(new Float64Array(3)),a8=new A.cD(new Float64Array(3))
this.a.a4b(a3,a5,a7)
this.b.a4b(a4,a6,a8)
w=1-a9
v=a3.m6(w).a0(0,a4.m6(a9))
u=a5.m6(w).a0(0,a6.m6(a9))
t=new Float64Array(4)
s=new B.oL(t)
s.c_(u)
s.A3(0)
r=a7.m6(w).a0(0,a8.m6(a9))
w=new Float64Array(16)
u=new A.bh(w)
q=t[0]
p=t[1]
o=t[2]
n=t[3]
m=q+q
l=p+p
k=o+o
j=q*m
i=q*l
h=q*k
g=p*l
f=p*k
e=o*k
d=n*m
a0=n*l
a1=n*k
a2=v.a
w[0]=1-(g+e)
w[1]=i+a1
w[2]=h-a0
w[3]=0
w[4]=i-a1
w[5]=1-(j+e)
w[6]=f+d
w[7]=0
w[8]=h+a0
w[9]=f-d
w[10]=1-(j+g)
w[11]=0
w[12]=a2[0]
w[13]=a2[1]
w[14]=a2[2]
w[15]=1
w=r.a
u.n6(w[0],w[1],w[2],1)
return u}}
B.Ew.prototype={
a2(){return new B.a6V(null,null)}}
B.a6V.prototype={
mC(d){var w,v,u,t=this,s=null,r=t.CW
t.a.toString
w=x.K
t.CW=w.a(d.$3(r,s,new B.aKg()))
r=t.cx
t.a.toString
v=x.Z
t.cx=v.a(d.$3(r,s,new B.aKh()))
r=x.h
t.cy=r.a(d.$3(t.cy,t.a.y,new B.aKi()))
u=t.db
t.a.toString
t.db=r.a(d.$3(u,s,new B.aKj()))
t.dx=x._.a(d.$3(t.dx,t.a.Q,new B.aKk()))
u=t.dy
t.a.toString
t.dy=v.a(d.$3(u,s,new B.aKl()))
u=t.fr
t.a.toString
t.fr=x.e.a(d.$3(u,s,new B.aKm()))
u=t.fx
t.a.toString
t.fx=w.a(d.$3(u,s,new B.aKn()))},
I(d){var w,v,u,t,s,r,q,p=this,o=null,n=p.gfo(),m=p.CW
m=m==null?o:m.am(0,n.gn(0))
w=p.cx
w=w==null?o:w.am(0,n.gn(0))
v=p.cy
v=v==null?o:v.am(0,n.gn(0))
u=p.db
u=u==null?o:u.am(0,n.gn(0))
t=p.dx
t=t==null?o:t.am(0,n.gn(0))
s=p.dy
s=s==null?o:s.am(0,n.gn(0))
r=p.fr
r=r==null?o:r.am(0,n.gn(0))
q=p.fx
q=q==null?o:q.am(0,n.gn(0))
return A.a4(m,p.a.r,C.i,o,t,v,u,o,s,w,r,q,o)}}
B.uZ.prototype={
a2(){return new B.NF()}}
B.NF.prototype={
af(){var w,v,u=this
u.ar()
u.a.toString
u.e=1
w=A.a([],x.M)
v=$.ay()
u.d!==$&&A.bI()
u.d=new B.pm(w,D.iz,v)
u.f=u.e},
anY(d){this.E(new B.aPo(this,d))},
I(d){var w,v=this,u=null,t=v.d
t===$&&A.b()
w=v.a.c
return A.eT(u,C.m,A.ds(C.at,A.a([A.Ji(0,A.eq(!1,A.alk(u,new B.BM(new A.dk("\u77ed\u5267\u8be6\u60c5","drama_"+w,"dramadetail","detail",u,!0,u,u),w,v.ganX(),u),t,x.n),!0,C.S,!0,!0)),A.e2(u,A.eq(!0,v.akG(),!0,C.S,!0,!0),u,u,0,0,0,u)],x.p),C.C,C.av),u,u,u,!1,!1,u,u,u,u)},
akG(){var w,v=null,u=A.a([C.m.aZ(0),C.I],x.Y),t=A.c9(A.bT(A.cp(C.eL,C.h,v,32),v,v),36,36),s=A.c9(v,v,12),r=this.f
r===$&&A.b()
w=x.p
return A.a4(v,A.bp(A.a([A.bW(v,new A.b0(new A.al(8,4,8,4),A.bp(A.a([t,s,A.a0("\u7b2c "+r+" \u96c6",v,v,v,v,v,A.az(v,v,C.h,v,v,v,v,v,v,v,v,20,v,v,C.ae,v,v,!0,v,v,v,v,v,A.a([new A.hf(C.m.aZ(0.3),new A.h(0,1),2)],x.q),v,v),v,v)],w),C.k,C.n,C.l,0),v),C.x,!1,v,v,v,v,v,v,v,v,v,v,v,v,v,v,v,v,v,new B.aPn(this),v,v,v,v,v,v,!1,C.J)],w),C.k,C.n,C.l,0),C.i,v,v,new A.aI(v,v,v,v,v,new A.hd(C.dp,C.fn,C.bw,u,v,v),v,C.w),v,50,v,new A.al(8,4,8,4),v,v,v)}}
B.I6.prototype={
N(){return"LoadingState."+this.b}}
B.pm.prototype={
rP(d,e){return this.aHn(d,e)},
aHn(d,e){var w=0,v=A.u(x.H),u,t=2,s=[],r=this,q,p,o,n,m,l,k
var $async$rP=A.v(function(f,g){if(f===1){s.push(g)
w=t}for(;;)switch(w){case 0:if(r.d===D.iA){w=1
break}r.d=D.iA
r.b=1
m=x.M
r.a=A.a([],m)
r.e=null
r.ak()
q=C.d.j(r.b)
if(d.b==="0")q=""
t=4
p=A.a([],m)
w=d.f?7:9
break
case 7:m=x.N
o=A.F(["PageIndex",q,"PageSize",C.d.j(5),"ChannelId","","GenderChannelType",""],m,m)
w=d.c==="dramadetail"&&e!=null&&e!==""?10:12
break
case 10:w=13
return A.l(B.a4K(e),$async$rP)
case 13:p=g
r.f=!1
w=11
break
case 12:w=14
return A.l(B.Cy(o),$async$rP)
case 14:p=g
r.f=J.aX(p)>=5
case 11:r.a=p
w=8
break
case 9:w=15
return A.l(A.Mf(d.e,!0,!0,q,C.d.j(5),d.d,d.c),$async$rP)
case 15:p=g
r.a=p
r.f=J.aX(p)>=5
case 8:r.d=D.iz
r.ak()
t=2
w=6
break
case 4:t=3
k=s.pop()
n=A.M(k)
r.e=J.a1(n)
r.d=D.p4
r.ak()
w=6
break
case 3:w=2
break
case 6:case 1:return A.r(u,v)
case 2:return A.q(s.at(-1),v)}})
return A.t($async$rP,v)},
zT(d){return this.aHq(d)},
aHq(d){var w=0,v=A.u(x.H),u,t=2,s=[],r=this,q,p,o,n,m,l,k
var $async$zT=A.v(function(e,f){if(e===1){s.push(f)
w=t}for(;;)switch(w){case 0:if(r.d===D.iA){w=1
break}r.d=D.iA
r.ak()
t=4
q=C.d.j(++r.b)
if(d.b==="0")q=""
p=A.a([],x.M)
w=d.f?7:9
break
case 7:m=x.N
o=A.F(["PageIndex",q,"PageSize",C.d.j(5),"ChannelId","","GenderChannelType",""],m,m)
w=10
return A.l(B.Cy(o),$async$zT)
case 10:p=f
w=8
break
case 9:w=11
return A.l(A.Mf(d.e,!0,!0,q,C.d.j(5),d.d,d.c),$async$zT)
case 11:p=f
case 8:J.cK(r.a,p)
r.f=J.aX(p)>=5
r.d=D.iz
r.e=null
r.ak()
t=2
w=6
break
case 4:t=3
k=s.pop()
n=A.M(k)
r.e=J.a1(n)
r.d=D.p4;--r.b
r.ak()
w=6
break
case 3:w=2
break
case 6:case 1:return A.r(u,v)
case 2:return A.q(s.at(-1),v)}})
return A.t($async$zT,v)},
Gz(d){return this.aH4(d)},
aH4(d){var w=0,v=A.u(x.y),u,t=2,s=[],r,q,p
var $async$Gz=A.v(function(e,f){if(e===1){s.push(f)
w=t}for(;;)switch(w){case 0:t=4
w=7
return A.l(B.aIu(d),$async$Gz)
case 7:r=f
u=r
w=1
break
t=2
w=6
break
case 4:t=3
p=s.pop()
u=!1
w=1
break
w=6
break
case 3:w=2
break
case 6:case 1:return A.r(u,v)
case 2:return A.q(s.at(-1),v)}})
return A.t($async$Gz,v)},
aKc(d){J.aip(this.a,new B.aID(d))
this.ak()},
HK(d,e){return this.aKv(d,e)},
aKv(d,e){var w=0,v=A.u(x.H),u=this
var $async$HK=A.v(function(f,g){if(f===1)return A.q(g,v)
for(;;)switch(w){case 0:u.d=D.iz
u.e=null
u.ak()
w=2
return A.l(u.rP(d,e),$async$HK)
case 2:return A.r(null,v)}})
return A.t($async$HK,v)}}
B.zG.prototype={
I(d){var w,v,u,t,s=null,r=x.w,q=A.bK(d,s,r).w
r=A.bK(d,s,r).w
w=A.bT(A.a4(s,s,C.i,s,s,new A.aI(C.ca,s,s,A.aG(2),s,s,s,C.w),s,4,D.U7,s,s,s,40),s,s)
v=x.p
u=A.a4(s,A.bp(A.a([D.Wv,C.ej,A.dx(A.a0(this.d,s,1,C.ao,s,s,C.ck,s,s),1),A.hZ(s,s,D.Wu,s,s,new B.aq8(d),s,s,s)],v),C.k,C.n,C.l,0),C.i,s,s,s,s,s,s,D.Um,s,s,s)
t=this.c
return A.a4(s,A.aV(A.a([w,u,D.Tt,A.dx(t===0?D.PI:A.vm(s,D.ak6,new B.aq9(this),t,C.bj,s,!1),1)],v),C.k,C.n,C.l,C.u),C.i,s,s,new A.aI(C.a9,s,s,C.rn,s,s,s,C.w),s,r.a.b*0.6,s,s,s,s,q.a.a)},
ah8(d){var w=null,v=d===this.e,u=A.aG(8),t=v?C.bJ:C.h.aZ(0.1),s=A.aG(8),r=v?w:A.eZ(C.h.aZ(0.05),1),q=v?C.h:C.X
return A.k2(!1,C.a0,!0,w,A.rl(!1,u,!0,A.a4(w,A.bT(A.a0(""+d,w,w,w,w,w,A.az(w,w,q,w,w,w,w,w,w,w,w,16,w,w,v?C.O:C.D,w,w,!0,w,w,w,w,w,w,w,w),w,w),w,w),C.i,w,w,new A.aI(t,w,r,s,w,w,w,C.w),w,w,w,w,w,w,w),w,!0,w,w,w,w,w,w,w,w,w,new B.aq7(this,d),w,w,w,w),C.i,C.I,0,w,w,w,w,w,C.ec)}}
B.BM.prototype={
a2(){return new B.x3(A.AL(0,1),A.C(x.r,x.J),A.a([],x.t))}}
B.x3.prototype={
ai3(d,e,f){var w=d.as
if(w===C.k3||w===C.i6)return this.ah6(d,e,f)
else return this.aht(d,e,f)},
aht(d,e,f){var w=this,v=null,u=w.r.h(0,e),t=w.e
return A.bT(B.be9(v,u,f,w.a.c.c!=="dramadetail",v,new B.aF_(w,e),new B.aF0(w,e),new B.aF1(w,e),e===t,v,d),v,v)},
ah6(d,e,f){var w=this,v=w.r.h(0,e),u=w.e
return A.ds(C.at,A.a([A.bT(B.be9(d.ax,v,f,w.a.c.c!=="dramadetail",new B.aEV(w,d),new B.aEW(w,e),new B.aEX(w,e),null,e===u,d.at,d),null,null)],x.p),C.C,C.av)},
axL(d){var w=this.c
w.toString
A.bho(C.I,new B.aFc(this,d),w,!0,!1,x.z)},
af(){var w=this
w.ar()
w.d.a1(0,w.gatt())
$.ad.p3$.push(new B.aFg(w))},
aiU(){var w,v,u,t,s,r,q,p,o=A.a([],x.t),n=this.r
n.aF(0,new B.aF2(this,o))
for(s=o.length,r=0;r<o.length;o.length===s||(0,A.O)(o),++r){w=o[r]
v=n.h(0,w)
if(v!=null){try{u=v.gT()
if(u!=null)if(u.c!=null){q=v.gT()
if(q!=null)q.e6(0)}else A.a9().$1("\u26a0\ufe0f \u89c6\u9891\u7ec4\u4ef6\u5df2 unmounted\uff0c\u65e0\u6cd5\u6682\u505c: "+A.k(w))}catch(p){t=A.M(p)
A.a9().$1("\u274c \u6e05\u7406\u89c6\u9891\u64ad\u653e\u5668\u65f6\u51fa\u9519: "+A.k(t))}n.G(0,w)}}A.a9().$1("\u5f53\u524d\u7f13\u5b58\u89c6\u9891\u6570\u91cf: "+n.a)},
atu(){var w,v=this,u=v.c
u.toString
w=A.cW(u,!1,x.n)
u=A.eo(w.a,x.E).length
A.a9().$1("\u5f53\u524d\u7d22\u5f15\uff1a"+v.e+" \u603b\u6570\uff1a"+u+" ")
if(v.e>=u-2&&w.f)w.zT(v.a.c)},
ats(d){var w,v,u=this,t=u.r,s=t.h(0,u.e)
if(s!=null){s=s.gT()
if(s!=null)s.e6(0)}u.E(new B.aF8(u,d))
t=t.h(0,u.e)
if(t!=null){t=t.gT()
if(t!=null)t.ep(0)}t=u.w
C.b.G(t,d)
t.push(d)
t=u.c
t.toString
w=A.cW(t,!1,x.n)
t=x.E
if(d<A.eo(w.a,t).length){v=A.eo(w.a,t)[d]
A.Hk(v,u.a.c.f?"drama":"short")}u.aiU()
u.avs()},
avs(){var w=this.x
if(w!=null)w.aI(0)
this.x=A.ct(C.cK,new B.aFa(this))},
l(){var w=this.x
if(w!=null)w.aI(0)
this.d.l()
this.aB()},
bZ(){this.dE()},
I(d){return A.zf(new B.aFf(this),x.n)},
V5(d,e,f){var w=null,v=C.h.aZ(0.1),u=A.aG(8),t=A.eZ(C.h.aZ(0.2),1),s=A.cp(d,C.h,w,24),r=A.mm(48,48)
return A.bdU(A.bW(w,new B.Ew(s,new A.aI(v,w,t,u,w,w,w,C.w),r,C.P,C.bS,w,w),C.x,!1,w,w,w,w,w,w,w,w,w,w,w,w,w,w,w,w,w,w,new B.aEY(),new B.aEZ(e),w,w,w,w,!1,C.J),f)},
amT(){if(this.e>0)this.d.a7o(C.cJ,C.aq)},
XJ(){var w,v=this.c
v.toString
w=A.cW(v,!1,x.n)
if(this.e<A.eo(w.a,x.E).length-1)this.d.a6V(C.cJ,C.aq)},
Ye(d){var w=this
A.a9().$1("\ud83d\udcf9 \u89c6\u9891\u64ad\u653e\u7ed3\u675f\uff0c\u7d22\u5f15: "+d+", \u5f53\u524d\u7d22\u5f15: "+w.e)
if(d===w.e&&w.a.c.c==="dramadetail")w.XJ()},
CC(d){return this.aqp(d)},
aqp(d){var w=0,v=A.u(x.H),u=this,t,s,r,q,p,o
var $async$CC=A.v(function(e,f){if(e===1)return A.q(f,v)
for(;;)switch(w){case 0:o=u.c
o.toString
t=A.cW(o,!1,x.n)
o=x.E
s=d+1
w=A.eo(t.a,o).length>s?2:3
break
case 2:r=$.db
if(r==null)r=$.db=new A.eB(200,1,"https://qcwotewlno9.rj2345.com",!1,180)
q=A.eo(t.a,o)[s]
w=4
return A.l(t.Gz(q.e),$async$CC)
case 4:p=f
A.a9().$1("isVideoUrlValid: "+A.k(p))
A.a9().$1("nextVideoUrl\u65e7: "+q.e)
if(!p)A.XG(new B.aF7(u,r,q,d),x.P)
case 3:return A.r(null,v)}})
return A.t($async$CC,v)},
Yf(d){var w,v,u,t=this,s=t.c
s.toString
w=A.cW(s,!1,x.n)
if(d<0||d>=A.eo(w.a,x.E).length)return
s=x.E
v=A.eo(w.a,s)[d].a
w.aKc(v)
A.a9().$1("failedVideoIndex: "+d)
A.a9().$1("_currentIndex: "+t.e)
u=t.e
if(d===u){if(u>=A.eo(w.a,s).length)if(A.eo(w.a,s).length!==0){t.E(new B.aF3(t,w))
$.ad.p3$.push(new B.aF4(t,w))}else A.a9().$1("\u6240\u6709\u89c6\u9891\u90fd\u5df2\u52a0\u8f7d\u5931\u8d25\u6216\u88ab\u5220\u9664")
else if(t.e<A.eo(w.a,s).length)$.ad.p3$.push(new B.aF5(t))}else if(d<u)t.E(new B.aF6(t))
A.a9().$1("\u89c6\u9891\u52a0\u8f7d\u5931\u8d25\u5e76\u5df2\u79fb\u9664: "+v)}}
B.Mm.prototype={
a2(){return new B.pn(C.F,new A.cj(C.F,$.ay()),null)}}
B.pn.prototype={
af(){this.aek()
if(this.c!=null)this.aA0()},
b2(d){var w,v=this
v.bk(d)
w=v.a.e
if(w!==d.e)if(w&&v.e){v.ep(0)
v.MY()}else if(!w&&v.e){v.e6(0)
w=v.as
if(w!=null)w.aI(0)}if(v.a.d.e!==d.d.e){w=v.as
if(w!=null)w.aI(0)
v.a6E(v.a.d)}},
yn(d){return this.aqX(d)},
aA0(){return this.yn(!1)},
aqX(a3){var w=0,v=A.u(x.H),u,t=2,s=[],r=this,q,p,o,n,m,l,k,j,i,h,g,f,e,d,a0,a1,a2
var $async$yn=A.v(function(a4,a5){if(a4===1){s.push(a5)
w=t}for(;;)switch(w){case 0:t=4
A.a9().$1("\ud83c\udfac [\u64ad\u653e\u5668] \u5f00\u59cb\u521d\u59cb\u5316\u89c6\u9891\u64ad\u653e\u5668")
A.a9().$1("\ud83c\udfac [\u64ad\u653e\u5668] videoUrl: "+r.a.d.e)
A.a9().$1("\ud83c\udfac [\u64ad\u653e\u5668] playUrl: "+A.k(r.a.d.f))
A.a9().$1("\ud83c\udfac [\u64ad\u653e\u5668] needJiemi: "+A.k(r.a.d.cx))
A.a9().$1("\ud83c\udfac [\u64ad\u653e\u5668] contentType: "+r.a.d.as.j(0))
h=r.a
g=h.d
f=g.cx
f.toString
if(f){if(a3||g.e.length===0){g=g.f
g=g!=null&&g.length!==0}else g=!1
if(g){e=$.db
q=e==null?$.db=new A.eB(200,1,"https://qcwotewlno9.rj2345.com",!1,180):e
A.a9().$1("\ud83c\udfac [\u64ad\u653e\u5668] \u89e3\u5bc6\u524d playDomain: "+q.c)
A.a9().$1("\ud83c\udfac [\u64ad\u653e\u5668] \u89e3\u5bc6\u524d playUrl: "+A.k(r.a.d.f))
h=q.c
g=r.a.d.f
g.toString
p=A.us(h,g)
A.a9().$1("\ud83c\udfac [\u64ad\u653e\u5668] \u89e3\u5bc6\u540e videoUrl: "+A.k(p))
g=r.a
g.d.e=p
h=g}}o=h.d.e
A.a9().$1("\ud83c\udfac [\u64ad\u653e\u5668] \u6700\u7ec8\u4f7f\u7528\u7684 videoUrl: "+A.k(o))
n=r.a.d.as.N()
h=r.a.d
g=A.k(n)
f=r.a.d
d=f.as.N()==="drama"?r.a.d.a:null
r.RE(h.a,"\u3010"+g+"\u3011"+f.b,d)
d=x.N
m=A.C(d,d)
h=r.a.d.as
if(h===C.cI){J.cK(m,A.F(["User-Agent",y.e,"Referer",$.eO+"/"],d,d))
h=$.arJ
J.cK(m,A.TB($.eO,h))}else if(h===C.fy)J.cK(m,A.F(["x-upstream-origin","https://t02h.beikept.com","x-referer-domain","https://www.1tow2.com"],d,d))
else if(h===C.i6){J.cK(m,A.F(["User-Agent",y.e],d,d))
q=$.db
if(q==null)q=$.db=new A.eB(200,1,"https://qcwotewlno9.rj2345.com",!1,180)
h=$.hY
a0=A.F(["x-upstream-origin",q.c],d,d)
a0.m(0,"x-referer-domain",h)
J.cK(m,a0)}A.a9().$1("\ud83c\udfac [\u64ad\u653e\u5668] HTTP Headers: "+A.k(m))
l=r.aA_(o)
A.a9().$1("\ud83c\udfac [\u64ad\u653e\u5668] \u63a8\u65ad\u7684\u89c6\u9891\u683c\u5f0f: "+A.k(l))
if(J.yr(o,"assets/")){k=J.bnk(o,"assets/","")
h=r.d=new A.CA(k,C.iP,null,C.tM,C.MS,$.ay())}else{A.a9().$1("\ud83c\udfac [\u64ad\u653e\u5668] \u521b\u5efa VideoPlayerController.networkUrl")
h=r.d=A.b6t(A.b7(o,0,null),l,m)}h.ws(r.a.x)
r.d.a1(0,r.gNI())
r.d.a1(0,new B.aIT(r))
A.a9().$1("\ud83c\udfac [\u64ad\u653e\u5668] \u5f00\u59cb\u8c03\u7528 initialize()...")
w=7
return A.l(r.d.cv(0),$async$yn)
case 7:A.a9().$1("\u2705 [\u64ad\u653e\u5668] initialize() \u6210\u529f")
if(r.at){w=1
break}h=r.a.d
if(h.c==null){j=r.d.a.a
if(C.d.aw(j.a,1e6)>0)h.c=j}if(r.c!=null)r.E(new B.aIU(r))
t=2
w=6
break
case 4:t=3
a2=s.pop()
i=A.M(a2)
A.a9().$1("\u274c \u89c6\u9891\u52a0\u8f7d\u9519\u8bef: "+A.k(i))
A.a9().$1("\u274c [\u64ad\u653e\u5668] \u9519\u8bef\u7c7b\u578b: "+J.a6(i).j(0))
A.a9().$1("\u274c [\u64ad\u653e\u5668] \u5f53\u524d videoUrl: "+r.a.d.e)
A.a9().$1("\u274c [\u64ad\u653e\u5668] \u5f53\u524d playUrl: "+A.k(r.a.d.f))
A.a9().$1("\u274c [\u64ad\u653e\u5668] needJiemi: "+A.k(r.a.d.cx))
A.a9().$1("\u274c [\u64ad\u653e\u5668] contentType: "+r.a.d.as.j(0))
if(C.c.t(J.a1(i),"MediaCodec")||C.c.t(J.a1(i),"decoder"))A.a9().$1("\u274c [\u64ad\u653e\u5668] \u8fd9\u662f\u89e3\u7801\u5668\u9519\u8bef")
if(C.c.t(J.a1(i),"EXTM3U")||C.c.t(J.a1(i),"ParserException")){A.a9().$1("\u274c [\u64ad\u653e\u5668] \u8fd9\u662f M3U8 \u89e3\u6790\u9519\u8bef\uff0c\u670d\u52a1\u5668\u8fd4\u56de\u7684\u5185\u5bb9\u4e0d\u662f\u6709\u6548\u7684 HLS \u64ad\u653e\u5217\u8868")
A.a9().$1("\u274c [\u64ad\u653e\u5668] \u8bf7\u68c0\u67e5 URL \u662f\u5426\u6b63\u786e\uff0c\u6216\u8005 URL \u662f\u5426\u8fd4\u56de\u4e86 HTML \u9519\u8bef\u9875\u9762")}if(r.c!=null)r.E(new B.aIV(r))
w=6
break
case 3:w=2
break
case 6:case 1:return A.r(u,v)
case 2:return A.q(s.at(-1),v)}})
return A.t($async$yn,v)},
aA_(d){var w=d.toLowerCase()
A.a9().$1("\ud83c\udfac [\u64ad\u653e\u5668] _guessVideoFormat \u68c0\u67e5 URL: "+d)
if(C.c.jv(w,"m3u8")||C.c.t(w,"m3u8?")||C.c.t(w,"/txt")||C.c.t(w,"/ts")){A.a9().$1("\ud83c\udfac [\u64ad\u653e\u5668] \u63a8\u65ad\u4e3a HLS \u683c\u5f0f")
return C.qM}A.a9().$1("\ud83c\udfac [\u64ad\u653e\u5668] \u4e0d\u6307\u5b9a\u683c\u5f0f hint\uff0c\u8ba9 ExoPlayer \u81ea\u52a8\u5224\u65ad")
return null},
MY(){var w=this.as
if(w!=null)w.aI(0)
this.as=A.xq(C.d7,new B.aIW(this))},
aA1(){var w,v,u,t,s,r,q=this,p=q.d
if(p!=null&&!q.x){w=p.a
v=w.b
u=w.a
p=q.r
t=v.a
if(t!==p.a){q.r=v
q.w.sn(0,v)
p=C.d.aw(u.a,1e6)
if(p>10){s=C.d.aw(q.r.a,1e6)
r=q.a.d
if(r.cx===!0&&s===p-10){p=q.Q
if(p!=null)p.aI(0)
q.Q=A.ct(C.cK,new B.aIY(q))}}}p=!1
if(!w.r)if(w.ax){p=u.a
p=p>0&&t>=p&&!w.f}if(p){if(!q.ax&&!q.at){q.ax=!0
q.a.w.$0()}}else if(t<u.a)q.ax=!1}},
ep(d){var w=this,v=w.d
if(v!=null)v.ep(0)
if(w.c!=null)w.E(new B.aJ4(w))},
e6(d){var w=this.d
if(w!=null)w.e6(0)
if(this.c!=null)this.E(new B.aJ3())},
azY(){var w=null,v=this.c
v.toString
v=A.a5(v).ok.z
return A.a4(w,A.bT(A.aV(A.a([D.uW,C.a3,A.a0("\u89c6\u9891\u52a0\u8f7d\u5931\u8d25",w,w,w,w,w,v==null?w:v.d6(C.h),w,w),C.a3,A.fA(C.jk,new B.aIL(this),w)],x.p),C.k,C.aB,C.l,C.u),w,w),C.i,C.m,w,w,w,w,w,w,w,w,w)},
V0(){var w=null,v=this.a.d.ch
if(v!=null)return A.jU(v,C.z,w,C.d1,w,!0,w,w)
return A.a4(w,D.PU,C.i,C.m,w,w,w,w,w,w,w,w,w)},
azZ(){return new A.pi(this.w,new B.aIQ(this),null,null,x.i)},
a1S(){if(this.c!=null)this.E(new B.aIZ())},
a2d(d){var w=d.a,v=C.d.aw(w,6e7),u=C.d.aA(C.d.aw(w,1e6),60)
return C.c.cZ(C.d.j(v),2,"0")+":"+C.c.cZ(C.d.j(u),2,"0")},
a6F(d,e){var w=this,v=w.d
if(v!=null)v.e6(0)
v=w.Q
if(v!=null)v.aI(0)
v=w.as
if(v!=null)v.aI(0)
v=w.d
if(v!=null)if(!v.cx)v.ll(0,w.gNI())
v=w.d
if(v!=null)v.l()
w.E(new B.aJ2(w))
w.yn(e)},
a6E(d){return this.a6F(d,!1)},
l(){var w,v=this
v.at=!0
w=v.Q
if(w!=null)w.aI(0)
w=v.as
if(w!=null)w.aI(0)
w=v.d
if(w!=null){if(!w.cx)w.ll(0,v.gNI())
v.d.l()}w=v.w
w.a8$=$.ay()
w.P$=0
v.aB()},
I(d){var w,v=this
v.tJ(d)
if(v.f)return v.azY()
w=A.bK(d,null,x.w).w.a
return A.HX(new B.aJ1(v,w,w.a/w.b))},
akZ(){var w=null,v=A.bC(128,C.m.M()>>>16&255,C.m.M()>>>8&255,C.m.M()&255),u=A.aG(30)
return A.aV(A.a([C.f7,A.bW(w,A.a4(C.z,A.bT(A.a0("\u89c2\u770b\u5b8c\u6574\u77ed\u5267\xb7\u5168"+A.k(this.a.d.at)+"\u96c6",w,w,w,w,w,C.jj,w,w),w,w),C.i,w,w,new A.aI(v,w,w,u,w,w,w,C.w),w,w,w,C.eF,w,w,w),C.x,!1,w,w,w,w,w,w,w,w,w,w,w,w,w,w,w,w,w,new B.aIS(this),w,w,w,w,w,w,!1,C.J)],x.p),C.k,C.n,C.l,C.u)},
go5(){return!0}}
B.R6.prototype={
af(){this.ar()
this.ou()},
em(){var w=this.fw$
if(w!=null){w.ak()
w.dD()
this.fw$=null}this.ln()}}
B.ag0.prototype={}
B.oL.prototype={
c_(d){var w=d.a,v=this.a,u=w[0]
v.$flags&2&&A.a2(v)
v[0]=u
v[1]=w[1]
v[2]=w[2]
v[3]=w[3]},
a9X(d){var w,v,u,t,s,r=d.a,q=r[0],p=r[4],o=r[8],n=0+q+p+o
if(n>0){w=Math.sqrt(n+1)
q=this.a
q.$flags&2&&A.a2(q)
q[3]=w*0.5
w=0.5/w
q[0]=(r[5]-r[7])*w
q[1]=(r[6]-r[2])*w
q[2]=(r[1]-r[3])*w}else{if(q<p)v=p<o?2:1
else v=q<o?2:0
u=(v+1)%3
t=(v+2)%3
q=v*3
p=u*3
o=t*3
w=Math.sqrt(r[q+v]-r[p+u]-r[o+t]+1)
s=this.a
s.$flags&2&&A.a2(s)
s[v]=w*0.5
w=0.5/w
s[3]=(r[p+t]-r[o+u])*w
s[u]=(r[q+u]+r[p+v])*w
s[t]=(r[q+t]+r[o+v])*w}},
A3(d){var w,v,u,t=Math.sqrt(this.gzO())
if(t===0)return 0
w=1/t
v=this.a
u=v[0]
v.$flags&2&&A.a2(v)
v[0]=u*w
v[1]=v[1]*w
v[2]=v[2]*w
v[3]=v[3]*w
return t},
gzO(){var w=this.a,v=w[0],u=w[1],t=w[2],s=w[3]
return v*v+u*u+t*t+s*s},
gA(d){var w=this.a,v=w[0],u=w[1],t=w[2],s=w[3]
return Math.sqrt(v*v+u*u+t*t+s*s)},
F(d,e){var w=e.a,v=this.a,u=v[0],t=w[0]
v.$flags&2&&A.a2(v)
v[0]=u+t
v[1]=v[1]+w[1]
v[2]=v[2]+w[2]
v[3]=v[3]+w[3]},
m6(d){var w=new Float64Array(4),v=new B.oL(w)
v.c_(this)
w[3]=w[3]*d
w[2]=w[2]*d
w[1]=w[1]*d
w[0]=w[0]*d
return v},
a3(a6,a7){var w,v,u,t,s,r,q,p,o,n,m,l,k,j,i,h,g=this.a,f=g[3],e=g[2],d=g[1],a0=g[0],a1=a7.gaLS(),a2=a1[3],a3=a1[2],a4=a1[1],a5=a1[0]
g=C.e.a3(f,a5)
w=C.e.a3(a0,a2)
v=C.e.a3(d,a3)
u=C.e.a3(e,a4)
t=C.e.a3(f,a4)
s=C.e.a3(d,a2)
r=C.e.a3(e,a5)
q=C.e.a3(a0,a3)
p=C.e.a3(f,a3)
o=C.e.a3(e,a2)
n=C.e.a3(a0,a4)
m=C.e.a3(d,a5)
l=C.e.a3(f,a2)
k=C.e.a3(a0,a5)
j=C.e.a3(d,a4)
i=C.e.a3(e,a3)
h=new Float64Array(4)
h[0]=g+w+v-u
h[1]=t+s+r-q
h[2]=p+o+n-m
h[3]=l-k-j-i
return new B.oL(h)},
k(d,e){var w,v,u
if(e==null)return!1
if(e instanceof B.oL){w=this.a
v=w[3]
u=e.a
w=v===u[3]&&w[2]===u[2]&&w[1]===u[1]&&w[0]===u[0]}else w=!1
return w},
gC(d){return A.cm(this.a)},
a0(d,e){var w=new B.oL(new Float64Array(4))
w.c_(this)
w.F(0,e)
return w},
U(d,e){var w,v=new Float64Array(4),u=new B.oL(v)
u.c_(this)
w=e.a
v[0]=v[0]-w[0]
v[1]=v[1]-w[1]
v[2]=v[2]-w[2]
v[3]=v[3]-w[3]
return u},
h(d,e){return this.a[e]},
m(d,e,f){var w=this.a
w.$flags&2&&A.a2(w)
w[e]=f},
j(d){var w=this.a
return A.k(w[0])+", "+A.k(w[1])+", "+A.k(w[2])+" @ "+A.k(w[3])}}
var z=a.updateTypes(["~()","pT(@)","~(p)","uD(@)","vV(@)","zG(D)","~(p,en<pn>)","j(D,pm,j?)"])
B.aKg.prototype={
$1(d){return new B.pT(x.D.a(d),null)},
$S:z+1}
B.aKh.prototype={
$1(d){return new A.mA(x.W.a(d),null)},
$S:131}
B.aKi.prototype={
$1(d){return new A.nZ(x.S.a(d),null)},
$S:235}
B.aKj.prototype={
$1(d){return new A.nZ(x.S.a(d),null)},
$S:235}
B.aKk.prototype={
$1(d){return new B.uD(x.k.a(d),null)},
$S:z+3}
B.aKl.prototype={
$1(d){return new A.mA(x.W.a(d),null)},
$S:131}
B.aKm.prototype={
$1(d){return new B.vV(x.l.a(d),null)},
$S:z+4}
B.aKn.prototype={
$1(d){return new B.pT(x.D.a(d),null)},
$S:z+1}
B.aPo.prototype={
$0(){this.a.f=this.b},
$S:0}
B.aPn.prototype={
$0(){var w=this.a.c
w.toString
A.cb(w,!1).f7(null)},
$S:0}
B.aID.prototype={
$1(d){return d.a===this.a},
$S:79}
B.aIb.prototype={
$1(d){return A.nf(x.a.a(d.b),d.a)},
$S:75}
B.aIm.prototype={
$1(d){return A.nf(x.a.a(d.b),d.a)},
$S:75}
B.aq8.prototype={
$0(){return A.cb(this.a,!1).cW()},
$S:0}
B.aq9.prototype={
$2(d,e){return this.a.ah8(e+1)},
$S:27}
B.aq7.prototype={
$0(){return this.a.f.$1(this.b)},
$S:0}
B.aF0.prototype={
$0(){return this.a.Yf(this.b)},
$S:0}
B.aF1.prototype={
$0(){return this.a.CC(this.b)},
$S:0}
B.aF_.prototype={
$0(){return this.a.Ye(this.b)},
$S:0}
B.aEX.prototype={
$0(){return this.a.Yf(this.b)},
$S:0}
B.aEV.prototype={
$0(){var w=this.a,v=this.b,u=v.as
if(u===C.k3){w=w.c
w.toString
A.dJ(w,C.ar,new B.uZ(v.a,null),x.X)}else if(u===C.i6)w.axL(v)
return null},
$S:0}
B.aEW.prototype={
$0(){return this.a.Ye(this.b)},
$S:0}
B.aFc.prototype={
$1(d){var w=this.b,v=w.at
if(v==null)v=0
return new B.zG(v,w.b,w.ax,new B.aFb(this.a,d,w),null)},
$S:z+5}
B.aFb.prototype={
$1(d){var w,v
A.cb(this.b,!1).cW()
w=this.a
v=w.a.r
if(v!=null)v.$1(d)
if(w.a.c.c==="dramadetail")w.d.GA(d-1)},
$S:857}
B.aFg.prototype={
$1(d){var w=this.a,v=w.c
if(v!=null){v=A.cW(v,!1,x.n)
w=w.a
v.rP(w.c,w.d)}},
$S:2}
B.aF2.prototype={
$2(d,e){if(Math.abs(d-this.a.e)>1)this.b.push(d)},
$S:z+6}
B.aF8.prototype={
$0(){this.a.e=this.b},
$S:0}
B.aFa.prototype={
$0(){var w,v,u,t,s,r,q,p=this.a,o=p.c
o.toString
w=A.eo(A.cW(o,!1,x.n).a,x.E)
o=p.a.r
if(o!=null){v=w[p.e]
o.$1(v.ax)}u=$.db
if(u==null)u=$.db=new A.eB(200,1,"https://qcwotewlno9.rj2345.com",!1,180)
t=p.e+1
s=C.d.dW(t+1,0,w.length-1)
for(p=x.P,r=t;r<=s;++r){q=w[r]
o=q.f
if(o!=null&&o.length!==0&&!$.fa().b.aD(0,o))A.XG(new B.aF9(u,q),p)}},
$S:0}
B.aF9.prototype={
$0(){var w=0,v=A.u(x.P),u=this,t,s,r,q,p
var $async$$0=A.v(function(d,e){if(d===1)return A.q(e,v)
for(;;)switch(w){case 0:try{r=u.b
q=r.f
q.toString
t=A.us(u.a.c,q)
$.fa().a2B(q,t)
r.e=t}catch(o){s=A.M(o)
A.a9().$1("\u9884\u52a0\u8f7d\u89c6\u9891\u5931\u8d25: "+u.b.d+", \u9519\u8bef: "+A.k(s))}return A.r(null,v)}})
return A.t($async$$0,v)},
$S:124}
B.aFf.prototype={
$3(d,e,f){var w,v,u,t=null,s=x.E
if(A.eo(e.a,s).length===0&&e.d===D.iA)return A.a4(t,C.ez,C.i,C.m,t,t,t,t,t,t,t,t,t)
if(A.eo(e.a,s).length===0&&e.d===D.p4){s=e.e
return A.a4(t,A.bT(A.aV(A.a([D.uW,C.a3,A.a0(s==null?"\u52a0\u8f7d\u5931\u8d25":s,t,t,t,t,t,C.dm,C.aY,t),C.bM,A.baZ(C.uX,C.jk,new B.aFd(this.a,e),A.hV(t,t,C.h,t,t,t,t,t,t,C.m,t,t,t,t,t,t,t,t,t,t))],x.p),C.k,C.aB,C.l,C.u),t,t),C.i,C.m,t,t,t,t,t,t,t,t,t)}if(A.eo(e.a,s).length===0)return A.a4(t,D.PL,C.i,C.m,t,t,t,t,t,t,t,t,t)
w=this.a
A.a9().$1("\u5f53\u524d\u7d22\u5f15\uff1a"+w.e+" \u603b\u6570\uff1a"+A.eo(e.a,s).length+" ")
s=A.eo(e.a,s)
v=e.f?1:0
u=x.p
return A.ds(C.at,A.a([A.a0O(!0,w.d,new B.aFe(w,e),s.length+v,w.gatr(),C.pA,C.a8),A.ds(C.at,A.a([A.e2(0,A.bT(w.V5(D.Vg,w.gamS(),"\u4e0a\u4e00\u9875"),t,t),t,t,16,t,0,t),A.e2(0,A.bT(w.V5(D.Vf,w.gamN(),"\u4e0b\u4e00\u9875"),t,t),t,t,t,16,0,t)],u),C.C,C.av)],u),C.C,C.av)},
$C:"$3",
$R:3,
$S:z+7}
B.aFd.prototype={
$0(){var w=this.a.a
return this.b.HK(w.c,w.d)},
$S:0}
B.aFe.prototype={
$2(d,e){var w,v,u,t=null,s=this.b,r=x.E
if(e>=A.eo(s.a,r).length)return A.a4(t,C.ez,C.i,C.m,t,t,t,t,t,t,t,t,t)
w=A.eo(s.a,r)[e]
v=this.a
if(Math.abs(e-v.e)<=1){u=v.r
if(!u.aD(0,e))u.m(0,e,new A.b_(t,x.B))
return v.ai3(w,e,A.eo(s.a,r).length)}else return A.a4(t,A.bT(A.qg(t,C.X,t,t,t,t,t,t,t,t),t,t),C.i,C.m,t,t,t,t,t,t,t,t,t)},
$S:27}
B.aEZ.prototype={
$1(d){return this.a.$0()},
$S:34}
B.aEY.prototype={
$0(){var w=x.z
return A.C(w,w)},
$S:0}
B.aF7.prototype={
$0(){var w=0,v=A.u(x.P),u=this,t,s,r,q,p,o
var $async$$0=A.v(function(d,e){if(d===1)return A.q(e,v)
for(;;)switch(w){case 0:try{q=u.c
p=q.f
p.toString
t=A.us(u.b.c,p)
$.fa().a2B(p,t)
q.e=t
A.a9().$1("nextVideoUrl\u65b0: "+A.k(t))
p=u.d+1
A.a9().$1("\u5f3a\u5236\u91cd\u65b0\u52a0\u8f7d\u4e0b\u4e00\u4e2a\u89c6\u9891\u64ad\u653e\u5668\uff0c\u7d22\u5f15: "+p)
s=u.a.r.h(0,p)
p=s
if((p==null?null:p.gT())!=null)s.gT().a6E(q)}catch(n){r=A.M(n)
A.a9().$1("\u9884\u52a0\u8f7d\u89c6\u9891\u5931\u8d25: "+A.k(u.c.f)+", \u9519\u8bef: "+A.k(r))}return A.r(null,v)}})
return A.t($async$$0,v)},
$S:124}
B.aF3.prototype={
$0(){this.a.e=A.eo(this.b.a,x.E).length-1},
$S:0}
B.aF4.prototype={
$1(d){var w=this.a,v=w.e
if(v>=0&&v<A.eo(this.b.a,x.E).length)w.d.uJ(w.e,C.cJ,C.aq)},
$S:2}
B.aF5.prototype={
$1(d){var w=this.a
w.d.uJ(w.e,C.cJ,C.aq)},
$S:2}
B.aF6.prototype={
$0(){--this.a.e},
$S:0}
B.aIT.prototype={
$0(){var w=this.a.d.a
if(w.z!=null)A.a9().$1("\u274c [\u64ad\u653e\u5668] \u64ad\u653e\u5668\u5185\u90e8\u9519\u8bef: "+A.k(w.z))},
$S:0}
B.aIU.prototype={
$0(){var w=this.a
w.e=!0
w.a.toString
w.MY()},
$S:0}
B.aIV.prototype={
$0(){var w=this.a
w.f=!0
A.a9().$1("\u64ad\u653e\u5668\u521d\u59cb\u5316\u5931\u8d25:"+w.a.d.e)},
$S:0}
B.aIW.prototype={
$1(d){var w,v=this.a,u=v.d
if(u!=null){u=u.a
u=!u.f||!u.ax}else u=!0
if(u)return
u=v.c
u.toString
w=A.cW(u,!1,x.I)
if(w.Og()){u=v.c
u.toString
v=v.d
v.toString
w.T5(u,v)}},
$S:53}
B.aIY.prototype={
$0(){$.ad.p3$.push(new B.aIX(this.a))},
$S:0}
B.aIX.prototype={
$1(d){var w=this.a
if(!w.at&&w.c!=null){w=w.a.r
if(w!=null)w.$0()}},
$S:2}
B.aJ4.prototype={
$0(){this.a.MY()},
$S:0}
B.aJ3.prototype={
$0(){},
$S:0}
B.aIL.prototype={
$0(){var w=this.a
w.a6F(w.a.d,!0)},
$S:0}
B.aIQ.prototype={
$3(d,e,f){var w,v,u,t,s,r=null,q=this.a,p=q.d,o=p==null?r:p.a.a
if(o==null)o=C.F
p=C.d.aw(o.a,1000)
w=p>0?C.e.dW(C.d.aw(e.a,1000)/p,0,1):0
p=q.ay
if(p==null)p=q.ay=A.bK(d,C.jr,x.w).w.a
v=q.x?1:0
p=A.c9(new A.eX(C.z,r,r,A.jF(A.a0(q.a2d(e)+" / "+q.a2d(o),r,r,r,r,r,C.hu,C.aY,r),C.P,D.tZ,v),r),r,p.a)
v=A.a4(r,r,C.i,C.I,r,r,r,20,r,r,r,r,r)
u=q.y
t=A.aG(q.z)
s=x.p
return A.e2(2,A.aV(A.a([p,C.bB,A.bW(r,A.c9(A.ds(C.dq,A.a([v,A.e2(r,A.a4(r,A.ds(C.at,A.a([A.bbf(C.dq,A.a4(r,r,C.i,r,r,new A.aI(C.h,r,r,A.aG(1),r,r,r,C.w),r,r,r,r,r,r,r),w)],s),C.C,C.ml),C.i,r,r,new A.aI(D.jY,r,r,t,r,r,r,C.w),r,u,r,r,r,r,r),r,r,0,0,(20-u)/2,r)],s),C.C,C.av),20,r),C.x,!1,r,r,r,r,new B.aIM(q),new B.aIN(q),new B.aIO(q,o),r,r,r,r,r,r,r,r,r,r,r,r,new B.aIP(q,e,o),r,r,r,r,!1,C.J)],s),C.a_,C.n,C.l,C.u),r,r,16,16,r,r)},
$S:858}
B.aIP.prototype={
$1(d){var w,v,u=this.a,t=u.d
if(t!=null&&t.a.ax){t=u.ay.a
w=C.d.aw(this.c.a,1000)
v=u.r=A.d4(0,0,0,C.e.er(C.e.dW(d.b.a/(t-32)*w,0,w)),0,0)
u.w.sn(0,v)
u.d.fH(v)}},
$S:34}
B.aIN.prototype={
$1(d){var w=this.a
w.x=!0
w.z=w.y=8
w.a1S()},
$S:26}
B.aIO.prototype={
$1(d){var w,v=this.a,u=v.d
if(u!=null&&u.a.ax){w=v.r=A.d4(0,0,0,C.e.er(d.a.a/v.ay.a*C.d.aw(this.b.a,1000)),0,0)
v.w.sn(0,w)
v.d.fH(w)}},
$S:16}
B.aIM.prototype={
$1(d){var w=this.a
w.x=!1
w.z=w.y=1
w.a1S()},
$S:33}
B.aIZ.prototype={
$0(){},
$S:0}
B.aJ2.prototype={
$0(){var w=this.a
w.d=null
w.f=w.e=!1
w.r=C.F
w.ax=w.at=!1},
$S:0}
B.aJ1.prototype={
$2(d,e){var w,v,u,t,s,r,q,p,o=null,n=this.b,m=n.b,l=n.a
n=this.a
if(n.e){w=n.d
v=J.SI(w.a)
u=v<=this.c?C.d1:C.dW
t=v>1?l:o
s=v<=1?m:o
r=A.aqp(C.z,A.c9(new A.lk(v,new A.Cz(w,o),o),s,t),u)}else r=n.a.d.ch!=null?n.V0():A.a4(o,o,C.i,C.m,o,o,o,o,o,o,o,o,o)
w=x.p
t=A.a([r],w)
if(!n.e&&n.a.d.ch!=null)t.push(A.Ji(0,n.V0()))
if(n.e){s=x.w
q=A.bK(d,o,s).w
s=A.bK(d,o,s).w
p=n.d.a.f?0:1
t.push(A.bW(o,A.bT(A.a4(o,A.jF(A.cp(D.VI,A.bC(128,C.h.M()>>>16&255,C.h.M()>>>8&255,C.h.M()&255),o,120),C.P,D.tZ,p),C.i,o,o,new A.aI(C.I,o,o,o,o,o,o,C.w),o,s.a.b*0.7,o,o,o,o,q.a.a*0.9),o,o),C.x,!1,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,new B.aJ0(n),o,o,o,o,o,o,!1,C.J))}if(n.e)t.push(n.azZ())
if(n.e&&!n.x){w=A.a([A.a0(n.a.d.b,o,2,C.ao,o,o,C.Mt,o,o)],w)
s=n.a.d.r
if(s.length!==0)w.push(new A.b0(D.u2,A.a0("#"+s,o,o,o,o,o,C.hs,o,o),o))
if(n.e){s=n.a.d.at
s=s!=null&&s>1}else s=!1
if(s)w.push(n.akZ())
t.push(A.e2(26,A.aV(w,C.a_,C.n,C.l,C.u),o,o,16,16,o,o))}return A.ds(C.at,t,C.C,C.ml)},
$S:244}
B.aJ0.prototype={
$0(){var w=this.a
w.E(new B.aJ_(w))},
$S:0}
B.aJ_.prototype={
$0(){var w=this.a.d
if(w.a.f)w.e6(0)
else w.ep(0)},
$S:0}
B.aIS.prototype={
$0(){var w=this.a,v=w.a.y
if(v!=null)v.$0()
if(w.d.a.f)w.E(new B.aIR(w))},
$S:0}
B.aIR.prototype={
$0(){this.a.d.e6(0)},
$S:0};(function aliases(){var w=B.R6.prototype
w.aek=w.af})();(function installTearOffs(){var w=a._instance_1u,v=a._instance_0u
w(B.NF.prototype,"ganX","anY",2)
var u
v(u=B.x3.prototype,"gatt","atu",0)
w(u,"gatr","ats",2)
v(u,"gamS","amT",0)
v(u,"gamN","XJ",0)
v(B.pn.prototype,"gNI","aA1",0)})();(function inheritance(){var w=a.mixinHard,v=a.mixin,u=a.inheritMany,t=a.inherit
u(A.aY,[B.pT,B.uD,B.vV])
t(B.Ew,A.Hv)
t(B.a6V,A.pV)
u(A.j4,[B.aKg,B.aKh,B.aKi,B.aKj,B.aKk,B.aKl,B.aKm,B.aKn,B.aID,B.aIb,B.aIm,B.aFc,B.aFb,B.aFg,B.aFf,B.aEZ,B.aF4,B.aF5,B.aIW,B.aIX,B.aIQ,B.aIP,B.aIN,B.aIO,B.aIM])
u(A.X,[B.uZ,B.BM,B.Mm])
u(A.Z,[B.NF,B.x3,B.R6])
u(A.mt,[B.aPo,B.aPn,B.aq8,B.aq7,B.aF0,B.aF1,B.aF_,B.aEX,B.aEV,B.aEW,B.aF8,B.aFa,B.aF9,B.aFd,B.aEY,B.aF7,B.aF3,B.aF6,B.aIT,B.aIU,B.aIV,B.aIY,B.aJ4,B.aJ3,B.aIL,B.aIZ,B.aJ2,B.aJ0,B.aJ_,B.aIS,B.aIR])
t(B.I6,A.xK)
t(B.pm,A.bb)
t(B.zG,A.aL)
u(A.nS,[B.aq9,B.aF2,B.aFe,B.aJ1])
t(B.ag0,B.R6)
t(B.pn,B.ag0)
t(B.oL,A.V)
w(B.R6,A.ml)
v(B.ag0,A.j1)})()
A.E_(b.typeUniverse,JSON.parse('{"pT":{"aY":["il?"],"aO":["il?"],"aY.T":"il?","aO.T":"il?"},"uD":{"aY":["aq"],"aO":["aq"],"aY.T":"aq","aO.T":"aq"},"vV":{"aY":["bh"],"aO":["bh"],"aY.T":"bh","aO.T":"bh"},"Ew":{"X":[],"j":[]},"a6V":{"Z":["Ew"]},"uZ":{"X":[],"j":[]},"NF":{"Z":["uZ"]},"pm":{"bb":[],"ao":[]},"zG":{"aL":[],"j":[]},"BM":{"X":[],"j":[]},"x3":{"Z":["BM"]},"Mm":{"X":[],"j":[]},"pn":{"Z":["Mm"]}}'))
var y={e:"Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",h:"application/x-www-form-urlencoded; charset=UTF-8"}
var x=(function rtii(){var w=A.aQ
return{D:w("il"),I:w("mi"),k:w("aq"),S:w("ip"),W:w("dR"),J:w("en<pn>"),Y:w("E<x>"),O:w("E<a7>"),q:w("E<hf>"),M:w("E<d2>"),p:w("E<j>"),t:w("E<p>"),B:w("b_<pn>"),Q:w("B<d2>"),j:w("B<@>"),a:w("aR<m,@>"),l:w("bh"),w:w("hC"),P:w("bD"),N:w("m"),i:w("pi<b5>"),E:w("d2"),n:w("pm"),y:w("R"),z:w("@"),r:w("p"),K:w("pT?"),_:w("uD?"),h:w("nZ?"),Z:w("mA?"),e:w("vV?"),X:w("V?"),H:w("~")}})();(function constants(){D.aqS=new A.b6("\u6682\u65e0\u96c6\u6570\u6570\u636e",null,C.el,null,null,null,null,null,null,null)
D.PI=new A.cu(C.z,null,null,D.aqS,null)
D.aqX=new A.b6("\u6682\u65e0\u89c6\u9891",null,C.hu,null,null,null,null,null,null,null)
D.PL=new A.cu(C.z,null,null,D.aqX,null)
D.Q1=new A.eJ(2,null,null,null,null,C.h,null,null,null,null)
D.PU=new A.cu(C.z,null,null,D.Q1,null)
D.jY=new A.x(0.23921568627450981,1,1,1,C.f)
D.Tt=new A.Gk(1,null,C.Rc,null)
D.tZ=new A.b5(8e4)
D.U7=new A.al(0,12,0,8)
D.u2=new A.al(0,8,0,0)
D.Um=new A.al(20,8,20,8)
D.Vf=new A.bf(58195,"MaterialIcons",null,!1)
D.Vg=new A.bf(58198,"MaterialIcons",null,!1)
D.VI=new A.bf(983200,"MaterialIcons",null,!1)
D.uW=new A.c2(C.dE,48,C.h,null,null)
D.Wu=new A.c2(C.e1,null,C.X,null,null)
D.Vo=new A.bf(58580,"MaterialIcons",null,!1)
D.Wv=new A.c2(D.Vo,24,C.h,null,null)
D.iz=new B.I6(0,"idle")
D.iA=new B.I6(1,"loading")
D.p4=new B.I6(2,"error")
D.ak6=new A.tv(5,12,12,1.2)})()};
(a=>{a["cOgMLJmkx795Uh1No6AxMqQ8mN8="]=a.current})($__dart_deferred_initializers__);