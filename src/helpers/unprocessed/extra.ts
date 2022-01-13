/*
#include <stdio.h>
#include "files.h"
extern FILE * openuaf();
extern FILE * openroom();
extern char *pname();
extern char globme[];
extern char wordbuf[];
extern long mynum;
extern long curch;
extern long my_lev;
long getnarg();



helpcom()
    {
extern char wordbuf[];
extern long curch,mynum;
extern char globme[];
extern long my_lev;
long a;
char b[128];
if(brkword()!= -1)
{
	a = await world.findVisiblePlayerByName(wordbuf, user, user.isBlind);
	if(a== -1)
	{
		bprintf("Help who ?\n");
		return;
	}
	if((a.locationId !== user.locationId))
	{
		bprintf("They are not here\n");
		return;
	}
	if(a==mynum)
	{
		bprintf("You can't help yourself.\n");
		return;
	}
	if(user.player.helping !== null)
	{
		sprintf(b,"${light(user.name)} has stopped helping you\n");
		sendsys(pname(a),pname(a),-10011,curch,b);
		bprintf("Stopped helping %s\n",world.getPlayer(user.player.helping).name);
	}
	user.player.helping = a;
	sprintf(b,"${light(user.name)} has offered to help you\n");
	sendsys(pname(a),pname(a),-10011,curch,b);
	bprintf("OK...\n");
	return;
    }
    World.save();

    bprintf(fromFile(HELP1));
    if(my_lev>9)
       {
       bprintf("Hit <Return> For More....\n");
        await g.world.save();
        const messages = await getMessages(bprintf.dirty, bprintf.unfinished);
       while(getchar()!='\n');
       bprintf(fromFile(HELP2));
       }
    bprintf("\n");
    if(my_lev>9999)
       {
       bprintf("Hit <Return> For More....\n");
        await g.world.save();
        const messages = await getMessages(bprintf.dirty, bprintf.unfinished);
       while(getchar()!='\n');
       bprintf(fromFile(HELP3));
       }
    bprintf("\n");
    }

 levcom()
    {
    World.save();

    bprintf(fromFile(LEVELS));
    }

 valuecom()
    {
    long a,b;
    extern char wordbuf[];
    extern long mynum;
    if(brkword()== -1)
       {
       bprintf("Value what ?\n");
       return;
       }
    b=fobna(wordbuf);
    if(b== -1)
       {
       bprintf("There isn't one of those here.\n");
       return;
       }
    bprintf("%s : %d points\n",wordbuf, (tscale() * b.value) / 5);
    return;
    }
 stacom()
    {
    long a,b;
    extern long my_lev;
    if(brkword()== -1)
       {
       bprintf("STATS what ?\n");
       return;
       }
    if(my_lev<10)
       {
       bprintf("Sorry, this is a wizard command buster...\n");
       return;
       }
    a=fobn(wordbuf);
    if(a== -1)
       {
       statplyr();
       return;
       }
    bprintf("\nItem        :%s",a.name);
if(a.carryFlag === IS_CONTAINED_IN) bprintf(       "\nContained in:%s",getItem(a.locationId).name);
else
{
    if(a.CARRY_FLAG != IS_LOCATED_AT)bprintf("\nHeld By     :%s",getPlayer(a.locationId).name);
    else
       {bprintf("\nPosition    :");
       showname(a.locationId);
}
       }
    bprintf("\nState       :%d",state(a));
    bprintf("\nCarr_Flag   :%d",a.carryFlag);
    bprintf("\nSpare       :%d",a.flags.isDestroyed ? -1 : 0);
    bprintf("\nMax State   :%d",a.maxState);
    bprintf("\nBase Value  :%d",a.value);
    bprintf("\n");
    }
 examcom()
    {
    long a,b;
    FILE *x;
    char r[88];
    extern long mynum,curch;
    extern char globme[],wordbuf[];
    if(brkword()== -1)
       {
       bprintf("Examine what ?\n");
       return;
       }
    a=fobna(wordbuf);
    if(a== -1)
       {
       bprintf("You see nothing special at all\n");
       return;
       }
    switch(a)
       {
       case 144:
          if(getItem(144).flags.values[0] === 0)
             {
             getItem(144).flags.values[0] = 1;
             bprintf("You take a scroll from the tube.\n");
getItem(145).flags.isDestroyed = false;
            items[145].setLocation(user.playerId, IS_CARRIED_BY);
             return;
             }
          break;
       case 145:
          ;
          curch= -114;
          bprintf("As you read the scroll you are teleported!\n");
          destroy(145);
          await setLocationId(curch, brief);
          return;
       case 101:
          if(getItem(101).flags.values[0] === 0)
             {
             bprintf("You take a key from one pocket\n");
             getItem(101).flags.values[0] = 1;
             getItem(107).flags.isDestroyed = false;
            items[107].setLocation(user.playerId, IS_CARRIED_BY);
             return;
             }
          break;
       case 7:
          setstate(7, randomizer() % 3 + 1);
          switch(state(7))
             {
             case 1:
                bprintf("It glows red");break;
             case 2:
                bprintf("It glows blue");break;
             case 3:
                bprintf("It glows green");break;
                }
          bprintf("\n");
          return;
       case 8:
          if(state(7)!=0)
             {
             if((iscarrby(3+state(7),mynum))&&(getItem(3+state(7)).flags.isLit))
                {
                bprintf("Everything shimmers and then solidifies into a different view!\n");
                destroy(8);
                teletrap(-1074);
                return;
       case 85:
          if(!getItem(83).flags.values[0])
             {
             bprintf("Aha. under the bed you find a loaf and a rabbit pie\n");
             getItem(83).flags.isDestroyed = false;
             getItem(84).flags.isDestroyed = false;
             getItem(83).flags.values[0] = 1;
             return;
             }
          break;
       case 91:
          if(!getItem(90).flags.values[0])
             {
             getItem(90).flags.isDestroyed = false;
             bprintf("You pull an amulet from the bedding\n");
             getItem(90).flags.values[0] = 1;
             return;
             }
          break;
          }
       }
    break;
    }

 sprintf(r,"%s%d",EXAMINES,a);
 x=fopen(r,"r");
 if(x==NULL)
 {
 bprintf("You see nothing special.\n");
 return;
 }
 else
 {
   x.getStrings(255, (r) => {
    bprintf("%s\n",r);
   })
 fclose(x);
 }
 }

 statplyr()
 {
 extern char wordbuf[];
 long a,b;
 b = await world.findVisiblePlayerByName(wordbuf, user, user.isBlind);
 if(b== -1)
 {
 bprintf("Whats that ?\n");
 return;
 }
 bprintf("Name      : %s\n",pname(b));
 bprintf("Level     : %d\n",b.level);
 bprintf("Strength  : %d\n",b.strength);
 bprintf("Sex       : %s\n",(b.getGender() === GENDER_MALE) ? "MALE" : "FEMALE");
 bprintf("Location  : ");
 showname(b.locationId);
 }
 wizlist()
 {
 extern long my_lev;
 if(my_lev<10)
 {
 bprintf("Huh ?\n");
 return;
 }
    World.save();

 bprintf("\001f%s\001",WIZLIST);
 }

 incom()
 {
 extern long my_lev,curch;
 extern char wordbuf[];
 char st[80],rn[80],rv[80];
 long ex_bk[7];
 extern long ex_dat[];
 long a;
 long x;
 long y;
 FILE *unit;
 a=0;
 if(my_lev<10){bprintf("Huh\n");return;}
 while(a<7)
 {
 ex_bk[a]=ex_dat[a];
 a++;
 }
 if(brkword()== -1)
 {
 bprintf("In where ?\n");
 return;
 }
 strcpy(rn,wordbuf);
 if(brkword()== -1)
 {
 bprintf("In where ?\n");
 return;
 }
 strcpy(rv,wordbuf);
 x=roomnum(rn,rv);
 if(x==0)
 {
 bprintf("Where is that ?\n");
 return;
 }
 getreinput(st);
 y=curch;
 curch=x;
    World.save();

 unit=openroom(curch,"r");
if(unit==NULL){curch=y;bprintf("No such room\n");return;}
 lodex(unit);
 fclose(unit);

    world = await World.load();
 gamecom(st);

    world = await World.load();
 if(curch==x)
 {
 a=0;
 while(a<7) {ex_dat[a]=ex_bk[a];a++;}
 }
 curch=y;
 }
 smokecom()
 {
 lightcom();
 }

 jumpcom()
 {
 long a,b;
 extern long jumtb[],mynum,curch;
 extern long my_lev;
 char ms[128];
 extern char globme[];
 a=0;
 b=0;
 while(jumtb[a])
 {
 if(jumtb[a]==curch){b=jumtb[a+1];break;}
 a+=2;
 }
 if(b==0){bprintf("Wheeeeee....\n");
 return;}
 if((my_lev<10)&&((!iscarrby(1,mynum))||(state(1)==0)))
 {
 	curch=b;
 bprintf("Wheeeeeeeeeeeeeeeee  <<<<SPLAT>>>>\n");
 bprintf("You seem to be splattered all over the place\n");
 return loose('I suppose you could be scraped up - with a spatula');
 }
 sprintf(ms, visual(user.name, '${user.name} has just left\n'));
            await sendGlobalMessage(
                user.name,
                user.locationId,
                ms,
            );
 curch=b;
 sprintf(ms, visual(user.name, '${user.name} has just dropped in\n'));
            await sendGlobalMessage(
                user.name,
                user.locationId,
                ms,
            );
 await setLocationId(b, brief);
 }

long jumtb[]={-643,-633,-1050,-662,-1082,-1053,0,0};

wherecom()
 {
 extern long mynum,curch,my_lev;
 extern char wordbuf[];
 extern char globme[];
 long cha,rnd;
 extern long numobs;
 if(user.data.strength < 10)
 {
 bprintf("You are too weak\n");
 return;
 }
 if(my_lev<10) user.data.strength -= 2;
 rnd = randomizer();
 cha=10*my_lev;
if((iscarrby(111,mynum))||(iscarrby(121,mynum))||(iscarrby(163,mynum)))
   cha=100;
    World.save();

 if(rnd>cha)
 {
 bprintf("Your spell fails...\n");
 return;
 }
 cha=0;
 if(brkword()== -1)
 {
 bprintf("What is that ?\n");
 return;
 }
 rnd=0;
 while(cha<numobs)
 {
 if(!strcmp(cha.name,wordbuf))
    {
    rnd=1;
if(my_lev>9999) bprintf("[%3d]",cha);
    bprintf("%16s - ",cha.name);
    if((my_lev<10) && a.flags.isDestroyed) bprintf("Nowhere\n");
    else
       desrm(cha.locationId,cha.carryFlag);
    }
 cha++;
 }
 cha = await world.findVisiblePlayerByName(wordbuf, user, user.isBlind);
 if(cha!= -1)
 {
 rnd++;
 bprintf("%s - ",pname(cha));
 desrm(cha.locationId,0);
 }
 if(rnd) return;
 bprintf("I dont know what that is\n");
 }

 desrm(loc,cf)
 {
 extern long my_lev;
 FILE *a;
 FILE *unit;
 long b;
 long x[32];
 if((my_lev<10)&&(cf==0)&&(loc>-5))
 {
 bprintf("Somewhere.....\n");
 return;
 }
if(cf==3){
bprintf("In the %s\n",loc.name);
return;
}
 if(cf>0)
 {
 bprintf("Carried by ${light(pname(loc)}\n");
 return;
 }
 unit=openroom(loc,"r");
 if(unit==NULL)
 {
 bprintf("Out in the void\n");
 return;
 }
 b=0;
 while(b++<7) getstr(unit,x);
 bprintf("%-36s",x);
if(my_lev>9){bprintf(" | ");showname(loc);;}
else bprintf("\n");
 fclose(unit);
 }



edit_world()
{
	extern long my_lev,numobs;
	extern char wordbuf[];
	extern long ublock[];
	extern long objinfo[];
	char a[80],b,c,d;
	extern long genarg();
	extern long mynum;
	if(!user.player.flags.canPatch)
	{
		bprintf("Must be Game Administrator\n");
		return;
	}
	if(brkword()==-1)
	{
		bprintf("Must Specify Player or Object\n");
		return;
	}
	if(!strcmp(wordbuf,"player")) goto e_player;
	if(strcmp(wordbuf,"object"))
	{
		bprintf("Must specify Player or Object\n");
		return;
	}
	b=getnarg(0,numobs-1);
	if(b==-1) return;
	c=getnarg(0,3);
	if(c==-1) return;
	d=getnarg(0,0);
	if(d==-1) return;
	objinfo[4*b+c]=d;
        bprintf("Tis done\n");
        return;
e_player:b=getnarg(0,47);
	if(b==-1) return;
	c=getnarg(0,15);
	if(c==-1) return;
	d=getnarg(0,0);
	if(d==-1) return;
	ublock[16*b+c]=d;
        bprintf("Tis done\n");
        return;
}

long getnarg(bt,to)
long bt,to;
{
	extern char wordbuf[];
	long x;
	if(brkword()==-1)
	{
		bprintf("Missing numeric argument\n");
		return(-1);
	}
	x=numarg(wordbuf);
	if(x<bt) {bprintf("Invalid range\n");return(-1);}
	if((to)&&(x>to)) {bprintf("Invalid range\n");return(-1);}
	return(x);
}

 */