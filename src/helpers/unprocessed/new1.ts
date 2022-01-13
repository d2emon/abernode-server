/*
struct player_res
{
    char *p_name;
    long p_loc;
    long p_str;
    long p_sex;
    long p_lev;
};

typedef struct player_res PLAYER;

*//*
Extensions section 1
*//*

#include <stdio.h>

extern FILE * openuaf();
extern char * pname();
extern FILE * openroom();
extern char globme[];
extern char wordbuf[];

bouncecom()
{
    sillycom(visual(%s, '%s bounces around\n'));
    bprintf("B O I N G !!!!\n");
}

sighcom()
{
    if(chkdumb()) return;
    sillycom(sound('%s', ' sighs loudly\n'));
    bprintf("You sigh\n");
}

screamcom()
{
    if(chkdumb()) return;
    sillycom(sound(%s, ' screams loudly\n\001'));
    bprintf("ARRRGGGGHHHHHHHHHHHH!!!!!!\n");
}

*//* Door is 6 panel 49
*//*

ohereandget(onm)
long *onm;
{
    long b;
    extern char wordbuf[];
    if(brkword()==-1)
    {
        bprintf("Tell me more ?\n");
        return(-1);
    }

        const world = await World.load();
*onm=fobna(wordbuf);
    if(*onm==-1)
    {
        bprintf("There isn't one of those here\n");
        return(-1);
    }
    return(1);
}

state(ob)
{
    extern long objinfo[];
    return(objinfo[4*ob+1]);
}


opencom()
{
    extern long mynum,curch;
    long a,b;
    b=ohereandget(&a);
    if(b==-1) return;
    switch(a)
    {
        case 21:if(state(21)==0) bprintf("It is\n");
        else bprintf("It seems to be magically closed\n");
            break;
        case 1:
            if(state(1)==1)
            {
                bprintf("It is!\n");
            }
            else
            {
                setstate(1,1);
                bprintf("The Umbrella Opens\n");
            }
            break;
        case 20:
            bprintf("You can't shift the door from this side!!!!\n");break;
        default:
            if(!a.flags.canBeOpened)
            {
                bprintf("You can't open that\n");
                return;
            }
            if(state(a)==0)
            {
                bprintf("It already is\n");
                return;
            }
            if(state(a)==2)
            {
                bprintf("It's locked!\n");
                return;
            }
            setstate(a,0);bprintf("Ok\n");

    }
}

setstate(o,v)
{
    extern long objinfo[];
    objinfo[4*o+1]=v;
    if(o.flags.hasConnectedItem) objinfo[4*(o^1)+1]=v;

}

closecom()
{
    long a,b;
    b=ohereandget(&a);
    if(b==-1) return;
    switch(a)
    {
        case 1:
            if(state(1)==0) bprintf("It is closed, silly!\n");
            else
            {
                bprintf("Ok\n");
                setstate(1,0);
            }
            break;
        default:
            if(!a.flags.canBeOpened)
            {
                bprintf("You can't close that\n");
                return;
            }
            if(state(a)!=0)
            {
                bprintf("It is open already\n");
                return;
            }
            setstate(a,1);
            bprintf("Ok\n");
    }
}

lockcom()
{
    long a,b;
    extern long mynum;
    b=ohereandget(&a);
    if(b==-1) return;
    if(!await world.findItem(user.player, (i) => i.flags.isKey))
    {
        bprintf("You haven't got a key\n");
        return;
    }
    switch(a)
    {
        default:
            if(!a.canBeLocked)
            {
                bprintf("You can't lock that!\n");
                return;
            }
            if(state(a)==2)
            {
                bprintf("It's already locked\n");
                return;
            }
            setstate(a,2);
            bprintf("Ok\n");
    }
}

unlockcom()
{
    long a,b;
    extern long mynum;
    b=ohereandget(&a);
    if(b==-1) return;
    if(!await world.findItem(user.player, (i) => i.flags.isKey))
    {
        bprintf("You have no keys\n");
        return;
    }
    switch(a)
    {
        default:
            if(!a.flags.canBeLocked)
            {
                bprintf("You can't unlock that\n");
                return;
            }
            if(state(a)!=2)
            {
                bprintf("Its not locked!\n");
                return;
            }
            printf("Ok...\n");
            setstate(a,1);
            return;
    }
}


wavecom()
{
    extern long curch;
    long a,b;
    b=ohereandget(&a);
    if(b==-1) return;
    switch(a)
    {
        case 136:
            if((state(151)==1)&&(items[151].locationId==curch))
            {
                setstate(150,0);
                bprintf("The drawbridge is lowered!\n");
                return;
            }
            break ;
        case 158:
            bprintf("You are teleported!\n");
            teletrap(-114);
            return;
    }
    bprintf("Nothing happens\n");
}

blowcom()
{
    long a,b;
    b=ohereandget(&a);
    if(b== -1) return;
    bprintf("You can't blow that\n");
}


putcom()
{
    long a,b;
    char ar[128];
    extern char wordbuf[];
    extern long curch;
    long c;
    b=ohereandget(&a);
    if(b== -1) return;
    if(brkword()== -1)
    {
        bprintf("where ?\n");
        return;
    }
    if((!strcmp(wordbuf,"on"))||(!strcmp(wordbuf,"in")))
    {
        if(brkword()== -1)
        {
            bprintf("What ?\n");
            return;
        }
    }
    c=fobna(wordbuf);
    if(c== -1)
    {
        bprintf("There isn't one of those here.\n");
        return;
    }
    if(c==10)
    {
        if((a<4)||(a>6))
        {
            bprintf("You can't do that\n");
            return;
        }
        if(state(10)!=2)
        {
            bprintf("There is already a candle in it!\n");
            return;
        }
        bprintf("The candle fixes firmly into the candlestick\n");
        user.data.score += 50;
        destroy(a);
        getItem(10).flags.values[1] = a;
        getItem(10).flags.canBeLit = true;
        getItem(10).flags.canBeExtinguished = true;
        if(a.isLit)
        {
            getItem(10).isLit = true;
            setstate(10,0);
            return;
        }
        else
        {
            setstate(10,1);
            getItem(10).isLit = false;
        }
        return;
    }
    if(c==137)
    {
        if(state(c)==0)
        {
            a.setLocation(-162, IS_LOCATED_AT);
            bprintf("ok\n");
            return;
        }
        destroy(a);
        bprintf("It dissappears with a fizzle into the slime\n");
        if(a==108)
        {
            bprintf("The soap dissolves the slime away!\n");
            setstate(137,0);
        }
        return;
    }
    if(c==193)
    {
        bprintf("You can't do that, the chute leads up from here!\n");
        return;
    }
    if(c==192)
    {
        if(a==32)
        {
            bprintf("You can't let go of it!\n");
            return;
        }
        bprintf("It vanishes down the chute....\n");
        sprintf(ar,"The %s comes out of the chute!\n",a.name);
            await sendGlobalMessage(
                null,
                getItem(193).locationId,
                ar,
            );
        a.setLocation(items[193].locationId, IS_LOCATED_AT);
        return;
    }

    if(c==23)
    {
        if((a==19)&&(state(21)==1))
        {
            bprintf("The door clicks open!\n");
            setstate(20,0);
            return;
        }
        bprintf("Nothing happens\n");
        return;
    }
    if(c==a)
    {
        bprintf("What do you think this is, the goon show ?\n");
        return;
    }
    if(!c.flags.isContainer) {bprintf("You can't do that\n");return;}
    if(state(c)!=0){bprintf("That's not open\n");return;}
    if(a.flannel)
    {
        bprintf("You can't take that !\n");
        return;
    }
    if(dragget()) return;
    if(a==32)
    {
        bprintf("You can't let go of it!\n");
        return;
    }
    a.setLocation(c, IS_WEARING_BY);
    bprintf("Ok.\n");
    sprintf(ar,light(user.name, ' puts the %s in the %s.\n'),a.name,c.name);
            await sendGlobalMessage(
                user.name,
                user.locationId,
                ar,
            );
    if(a.flags.changeStateOnPut) setstate(a,0);
    if(curch==-1081)
    {
        setstate(20,1);
        bprintf("The door clicks shut....\n");
    }
}

lightcom()
{
    extern long mynum,curch;
    long a,b;
    b=ohereandget(&a);
    if(b== -1) return;
    if(!await world.findItem(user.player, (i) => i.flags.canBeLit))
    {
        bprintf("You have nothing to light things from\n");
        return;
    }
    switch(a)
    {
        default:
            if(!a.flags.canBeLit)
            {
                bprintf("You can't light that!\n");
                return;
            }
            if(state(a)==0)
            {
                bprintf("It is lit\n");
                return;
            }
            setstate(a,0);
            a.flags.isLit = true;
            bprintf("Ok\n");
    }
}

extinguishcom()
{
    long a,b;
    b=ohereandget(&a);
    if(b== -1) return;
    switch(a)
    {
        default:
            if(!a.flags.isLit)
            {
                bprintf("That isn't lit\n");
                return;
            }
            if(!a.flags.canBeExtinguished)
            {
                bprintf("You can't extinguish that!\n");
                return;
            }
            setstate(a,1);
            a.flags.isLit = false;
            bprintf("Ok\n");
    }
}

pushcom()
{
    extern long curch;
    extern char wordbuf[];
    extern long mynum;
    long fil;
    long x;
    if(brkword()== -1)
    {
        bprintf("Push what ?\n");
        return;
    }
    nbutt:    x=fobna(wordbuf);
    if(x== -1)
    {
        bprintf("That is not here\n");
        return;
    }
    switch(x)
    {
        case 126:
            bprintf("The tripwire moves and a huge stone crashes down from above!\n");
            broad(sound(null, 'You hear a thud and a squelch in the distance.\n'));
            return await loose('             S   P    L      A         T           !', { newEvents: true });
        case 162:
            bprintf("A trapdoor opens at your feet and you plumment downwards!\n");
            curch= -140;await setLocationId(curch, brief);
            return;
        case 130:
            if(state(132)==1)
            {
                setstate(132,0);
                bprintf("A secret panel opens in the east wall!\n");
                break;
            }
            bprintf("Nothing happens\n");
            break;
        case 131:
            if(state(134)==1)
            {
                bprintf("Uncovering a hole behind it.\n");
                setstate(134,0);
            }
            break;
        case 138:
            if(state(137)==0)
            {
                bprintf("Ok...\n");
                break;
            }
            else
            {
                bprintf("You hear a gurgling noise and then silence.\n");
                setstate(137,0);
            }
            break;
        case 146:
            ;
        case 147:
            setstate(146,1-state(146));
            bprintf("Ok...\n");
            break;
        case 30:
            setstate(28,1-state(28));
            if(state(28))
            {
                await sendGlobalMessage(
                    null,
                    getItem(28).locationId,
                    light("The portcullis falls\n"),
                );
                await sendGlobalMessage(
                    null,
                    getItem(29).locationId,
                    light("The portcullis falls\n"),
                );
            }
            else
            {
                await sendGlobalMessage(
                    null,
                    getItem(28).locationId,
                    light("The portcullis rises\n"),
                );
                await sendGlobalMessage(
                    null,
                    getItem(29).locationId,
                    light("The portcullis rises\n"),
                );
            }
            break;
        case 149:
            setstate(150,1-state(150));
            if(state(150))
            {
                await sendGlobalMessage(
                    null,
                    getItem(150).locationId,
                    light("The drawbridge rises\n"),
                );
                await sendGlobalMessage(
                    null,
                    getItem(151).locationId,
                    light("The drawbridge rises\n"),
                );
            }
            else
            {
                await sendGlobalMessage(
                    null,
                    getItem(150).locationId,
                    light("The drawbridge is lowered\n"),
                );
                await sendGlobalMessage(
                    null,
                    getItem(151).locationId,
                    light("The drawbridge is lowered\n"),
                );
            }
            break;
        case 24:
            if(state(26)==1)
            {
                setstate(26,0);
                bprintf("A secret door slides quietly open in the south wall!!!\n");
            }
            else
                bprintf("It moves but nothing seems to happen\n");
            return;
        case 49:
            broad(sound(null, 'Church bells ring out around you\n');
            result.newEvents = true;
            break;
        case 104:if(await user.player.getHelper() === null)
        {
            bprintf("You can't shift it alone, maybe you need help\n");
            break;
        }
            *//* ELSE RUN INTO DEFAULT *//*
            goto def2;
        default:;
            def2:
                if(x.flags.canBeTurnedOn)
                {
                    setstate(x,0);
                    oplong(x);
                    return;
                }
            if(x.canBeSwitched)
            {
                setstate(x,1-state(x));
                oplong(x);
                return;
            }
            bprintf("Nothing happens\n");
    }
}

cripplecom()
{
    long a,b;
    extern char globme[];
    extern long mynum,curch;
    b=victim(&a);
    if(b== -1) return;
    sendsys(pname(a),globme,-10101,curch,"");
}

curecom()
{
    long a,b;
    extern char globme[];
    extern long mynum,curch;
    b=vichfb(&a);
    if(b== -1) return;
    sendsys(pname(a),globme,-10100,curch,"");
}

dumbcom()
{
    long a,b;
    extern long mynum,curch;
    extern char globme[];
    b=victim(&a);
    if(b== -1) return;
    sendsys(pname(a),globme,-10102,curch,"");
}

forcecom()
{
    long a,b;
    extern long mynum,curch;
    extern char globme[];
    char z[128];
    b=victim(&a);
    if(b== -1) return;
    getreinput(z);
    sendsys(pname(a),globme,-10103,curch,z);
}

missilecom()
{
    long a,b;
    extern long mynum,curch;
    extern char globme[];
    extern long my_lev;
    extern long fighting,in_fight;
    long ar[8];
    b=vichfb(&a);
    if(b== -1) return;
    sprintf(ar,"%d",my_lev*2);
    sendsys(pname(a),globme,-10106,curch,ar);
    if(a.strength - 2 * my_lev < 0)
    {
        bprintf("Your last spell did the trick\n");
        if(!a.isDead())
        {
            *//* Bonus ? *//*
            if(a<16) user.data.score +=(a.level * a.level *100);
            else user.data.score +=10*damof(a);
        }
        a.strength = -1; *//* MARK ALREADY DEAD *//*
        in_fight=0;
        fighting= -1;
    }
    if(a>15) woundmn(a,2*my_lev);
}

changecom()
{
    long a,b;
    extern long mynum,curch;
    extern char globme[];
    extern char wordbuf[];
    if(brkword()== -1)
    {
        bprintf("change what (Sex ?) ?\n");
        return;
    }
    if(!!strcmp(wordbuf,"sex"))
    {
        bprintf("I don't know how to change that\n");
        return;
    }
    b=victim(&a);
    if(b== -1) return;
    sendsys(pname(a),globme,-10107,curch,"");
    if(a<16) return;
    a.flags.gender = 1 - a.getGender();
}

fireballcom()
{
    long a,b;
    extern long mynum,curch;
    extern long fighting,in_fight;
    extern char globme[];
    extern long my_lev;
    long ar[2];
    b=vichfb(&a);
    if(b== -1) return;
    if(mynum==a)
    {
        bprintf("Seems rather dangerous to me....\n");
        return;
    }
    sprintf(ar,"%d",2*my_lev);
    if(a.strength - (a == await world.findPlayerByName("yeti")?6:2)*my_lev<0)
    {
        bprintf("Your last spell did the trick\n");
        if(!a.isDead)
        {
            *//* Bonus ? *//*
            if(a<16) user.data.score += (a.level * a.level * 100);
            else user.data.score += 10*damof(a);
        }
        a.strength = -1; *//* MARK ALREADY DEAD *//*
        in_fight=0;
        fighting= -1;
    }
    sendsys(pname(a),globme,-10109,curch,ar);
    if(a == await world.findPlayerByName("yeti")) {woundmn(a,6*my_lev);return;}
    if(a>15) woundmn(a,2*my_lev);
}

shockcom()
{
    long a,b;
    extern long mynum,curch;
    extern char globme[];
    extern long my_lev;
    extern long fighting,in_fight;
    long ar[2];
    b=vichfb(&a);
    if(b== -1) return;
    if(a==mynum)
    {
        bprintf("You are supposed to be killing other people not yourself\n");
        return;
    }
    if(a.strength - 2 * my_lev < 0)
    {
        bprintf("Your last spell did the trick\n");
        if(!a.isDead())
        {
            *//* Bonus ? *//*
            if(a<16) user.data.score += (a.level * a.level * 100);
            else user.data.score += 10*damof(a);
        }
        a.strength = -1; *//* MARK ALREADY DEAD *//*
        in_fight=0;
        fighting= -1;
    }
    sprintf(ar,"%d",my_lev*2);
    sendsys(pname(a),globme,-10110,curch,ar);
    if(a>15) woundmn(a,2*my_lev);
}

starecom()
{
    extern long mynum;
    long a,b;
    b=vichere(&a);
    if(b== -1) return;
    if(a==mynum)
    {
        bprintf("That is pretty neat if you can do it!\n");
        return;
    }
    sillytp(a,"stares deep into your eyes\n");
    bprintf("You stare at ${ifPlayer(pname(a))}\n");
}

gropecom()
{
    extern long mynum;
    long a,b;
    extern long isforce;
    if(isforce){bprintf("You can't be forced to do that\n");return;}
    b=vichere(&a);
    if(b== -1) return;
    if(a==mynum)
    {
        bprintf("With a sudden attack of morality the machine edits your persona\n");
        return await loose('Bye....... LINE TERMINATED - MORALITY REASONS');
    }
    sillytp(a,"gropes you");
    bprintf("<Well what sort of noise do you want here ?>\n");
}

squeezecom()
{
    extern long mynum;
    long a,b;
    b=vichere(&a);
    if(b== -1) return;
    if(a==mynum)
    {
        bprintf("Ok....\n");
        return;
    }
    if(a== -1) return;
    sillytp(a,"gives you a squeeze\n");
    bprintf("You give them a squeeze\n");
    return;
}

kisscom()
{
    extern long mynum;
    long a,b;
    b=vichere(&a);
    if(b== -1) return;
    if(a==mynum)
    {
        bprintf("Weird!\n");
        return;
    }
    sillytp(a,"kisses you");
    bprintf("Slurp!\n");
}

cuddlecom()
{
    extern long mynum;
    long a,b;
    b=vichere(&a);
    if(b== -1) return;
    if(mynum==a)
    {
        bprintf("You aren't that lonely are you ?\n");
        return;
    }
    sillytp(a,"cuddles you");
}

hugcom()
{
    extern long mynum;
    long a,b;
    b=vichere(&a);
    if(b== -1) return;
    if(mynum==a)
    {
        bprintf("Ohhh flowerr!\n");
        return;
    }
    sillytp(a,"hugs you");
}

slapcom()
{
    extern long mynum;
    long a,b;
    b=vichere(&a);
    if(b== -1) return;
    if(mynum==a)
    {
        bprintf("You slap yourself\n");
        return;
    }
    sillytp(a,"slaps you");
}

ticklecom()
{
    extern long mynum;
    long a,b;
    b=vichere(&a);
    if(b== -1) return;
    if(a==mynum)
    {
        bprintf("You tickle yourself\n");
        return;
    }
    sillytp(a,"tickles you");
}

*//* This one isnt for magic *//*

vicbase(x)
long *x;
{
    long a,b;
    extern char wordbuf[];
    a0:if(brkword()== -1)
    {
        bprintf("Who ?\n");
        return(-1);
    }

        const b = await World.load();
    if(!strcmp(wordbuf,"at")) goto a0; *//* STARE AT etc *//*
    a = await world.findVisiblePlayerByName(wordbuf, user, user.isBlind);
    if(a== -1)
    {
        bprintf("Who ?\n");
        return(-1);
    }
*x=a;
    return(b);
}

vichere(x)
long *x;
{
    extern long curch;
    long a;
    a=vicbase(x);
    if(a== -1) return(a);
    if(x.locationId !== user.locationId)
    {
        bprintf("They are not here\n");
        return(-1);
    }
    return(a);
}


vicf2(x,f1)
long *x;
{
    extern long mynum;
    long a;
    extern long my_lev;
    extern long curch;
    long b,i;
    a=vicbase(x);
    if(a== -1) return(-1);
    if(user.data.strength < 10)
    {
        bprintf("You are too weak to cast magic\n");
        return(-1);
    }
    if(my_lev<10) user.data.strength -= 2;
    i=5;
    if(iscarrby(111,mynum)) i++;
    if(iscarrby(121,mynum)) i++;
    if(iscarrby(163,mynum)) i++;
    if((my_lev<10)&&(randomizer() > i*my_lev))
    {
        bprintf("You fumble the magic\n");
        if(f1==1){*x=mynum;bprintf("The spell reflects back\n");}
        else
        {
            return(-1);
        }
        return(a);
    }

    else
    {
        if(my_lev<10)bprintf("The spell succeeds!!\n");
        return(a);
    }
}

vicfb(x)
long *x;
{
    return(vicf2(x,0));
}
vichfb(x)
long *x;
{
    long a;
    extern long curch;
    a=vicfb(x);
    if(a== -1) return(-1);
    if(x.locationId !== user.locationId)
    {
        bprintf("They are not here\n");
        return(-1);
    }
    return(a);
}

victim(x)
long *x;
{
    return(vicf2(x,1));
}

sillytp(per,msg)
char *msg;
{
    extern long curch;
    extern char globme[];
    char bk[256];
    if(strncmp(msg,"star",4)==0)
        sprintf(bk, "%s", visual(user.name, '${user.name} ${msg}\n'));
    else
        sprintf(bk,"%s","${ifPlayer(user.name)} ${msg}\n");
    sendsys(pname(per),globme,-10111,curch,bk);
}

long ail_dumb=0;
long  ail_crip=0;
long  ail_blind=0;
long  ail_deaf=0;


new1rcv(isme,chan,to,from,code,text)
char *to,*from,*text;
{
    extern long mynum,my_lev,ail_dumb,ail_crip;
    extern long ail_deaf,ail_blind;
    extern long curch;
    extern char globme[];
    switch(code)
    {
        case -10100:
            if(isme==1) {
                bprintf("All your ailments have been cured\n");
                ail_dumb=0;
                ail_crip=0;
                ail_blind=0;ail_deaf=0;
            }
            break;
        case -10101:
            if(isme==1)
            {
                if(my_lev<10)
                {
                    bprintf("You have been magically crippled\n");
                    ail_crip=1;
                }

                else
                    bprintf("${ifPlayer(from)} tried to cripple you\n");
            }
            break;
        case -10102:
            if(isme==1)
            {
                if(my_lev<10)
                {
                    bprintf("You have been struck magically dumb\n");
                    ail_dumb=1;
                }

                else
                    bprintf("${ifPlayer(from)} tried to dumb you\n");
            }
            break;
        case -10103:
            if(isme==1)
            {
                if(my_lev<10)
                {
                    bprintf("${ifPlayer(from)} has forced you to %s\n",text);
                    addforce(text);
                }

                else
                    bprintf("${ifPlayer(from)} tried to force you to %s\n",text);
            }
            else
                break;
        case -10104:
            if(isme!=1)bprintf("${ifPlayer(from)} shouts '%s'\n",text);
            break;
        case -10105:
            if(isme==1)
            {
                if(my_lev<10)
                {
                    bprintf("You have been struck magically blind\n");
                    ail_blind=1;
                }

                else
                    bprintf("${ifPlayer(from)} tried to blind you\n");
            }
            break;
        case -10106:
            if(iam(from))break;
            if(curch==chan)
            {
                bprintf("Bolts of fire leap from the fingers of ${ifPlayer(from)}\n");
                if(isme==1)
                {
                    bprintf("You are struck!\n");
                    wounded(numarg(text));
                }

                else
                    bprintf("${ifPlayer(to)} is struck\n");
            }
            break;
        case -10107:
            if(isme==1)
            {
                bprintf("Your sex has been magically changed!\n");
                user.data.flags.gender = 1 - user.data.flags.gender;
                bprintf("You are now ");
                if(user.data.flags.gender === GENDER_FEMALE)bprintf("Female\n");
                else
                    bprintf("Male\n");
                calibme();
            }
            break;
        case -10109:
            if(iam(from)) break;
            if(curch==chan)
            {
                bprintf("${ifPlayer(from)} casts a fireball\n");
                if(isme==1)
                {
                    bprintf("You are struck!\n");
                    wounded(numarg(text));
                }

                else
                    bprintf("${ifPlayer(to)} is struck\n");
            }
            break;
        case -10110:
            if(iam(from)) break;
            if(isme==1)
            {
                bprintf("${ifPlayer(from)} touches you giving you a sudden electric shock!\n");
                wounded(numarg(text));
            }
            break;
        case -10111:
            if(isme==1)bprintf("%s\n",text);
            break;
        case -10113:
            if(my_lev>9)bprintf("%s",text);
            break;
        case -10120:
            if(isme==1)
            {
                if(my_lev>9)
                {
                    bprintf("${ifPlayer(from)} tried to deafen you\n");
                    break;
                }
                bprintf("You have been magically deafened\n");
                ail_deaf=1;
                break;
            }
    }
}

destroy(ob)
{
    ob.flags.isDestroyed = true;
}

tscale()
{
    long a,b;
    a=0;
    b=0;
    while(b<16)
    {
        if(!!strlen(pname(b))) a++;
        b++;
    }
    switch(a)
    {
        case 1:
            return(2);
        case 2:
            return(3);
        case 3:
            return(3);
        case 4:
            return(4);
        case 5:
            return(4);
        case 6:
            return(5);
        case 7:
            return(6);
        default:
            return(7);
    }
}

chkdumb()
{
    extern long ail_dumb;
    if(!ail_dumb) return(0);
    bprintf("You are dumb...\n");
    return(1);
}

chkcrip()
{
    extern long ail_crip;
    if(!ail_crip) return(0);
    bprintf("You are crippled\n");
    return(1);
}

chkblind()
{
    extern long ail_blind;
    if(!ail_blind) return(0);
    bprintf("You are blind, you cannot see\n");
    return(1);
}

chkdeaf()
{
    extern long ail_deaf;
    if(!ail_deaf) return(0);
    return(1);
}

wounded(n)
{
    extern long my_lev,curch;
    extern long me_cal;
    extern long zapped;
    extern char globme[];
    char ms[128];
    if(my_lev>9) return;
    user.data.strength -= n;
    me_cal=1;
    if(user.data.strength >= 0) return;
        await World.save();

    log.info("%s slain magically",globme);
    await UserStream.deleteUser(user.name);
    zapped=1;

        const world = await World.load();
    dumpitems();
    const result = await loose('Oh dear you just died');
    sprintf(ms,"%s has just died\n",globme);
            await sendGlobalMessage(
                user.name,
                user.locationId,
                ms,
            );
    sprintf(ms,"[ %s has just died ]\n",globme);
    await sendAdminMessage(
        user.name,
        user.locationId,
        ms,
    );
    return result;
}

woundmn(mon,am)
{
    extern long mynum;
    extern char globme[];
    long a;
    long b;
    char ms[128];
    a=mon.strength - am;
    mon.strength = a;

    if(a>=0){mhitplayer(mon,mynum);}

    else
    {
        dumpstuff(mon, mon.locationId);
        sprintf(ms,"%s has just died\n",pname(mon));
            await sendGlobalMessage(
                null,
                mon.locationId,
                ms,
            );
        sprintf(ms,"[ %s has just died ]\n",pname(mon));
        pname(mon)[0]=0;
        await sendAdminMessage(
            user.name,
            mon.locationId,
            ms,
        );
    }
}


mhitplayer(mon,mn)
{
    extern long curch,my_lev,mynum;
    long a,b,x[4];
    extern char globme[];
    if(mon.locationId !== user.locationId) return;
    if((mon<0)||(mon>47)) return;
    a = randomizer();
    b=3*(15-my_lev)+20;
    if((iswornby(89,mynum))||(iswornby(113,mynum))||(iswornby(114,mynum)))
        b-=10;
    if(a<b)
    {
        x[0]=mon;
        x[1] = randomizer() % damof(mon);
        x[2]= -1;
        sendsys(globme,pname(mon),-10021, mon.locationId, (char *)x);
    }

    else
    {

        x[0]=mon;
        x[2]= -1;
        x[1]= -1;
        sendsys(globme,pname(mon),-10021, mon.locationId, x) ;
    }
}

resetplayers()
{
    extern PLAYER pinit[];
    long a,b,c;
    a=16;
    c=0;
    while(a<35)
    {
        strcpy(pname(a),pinit[c].p_name);
        a.locationId = pinit[c].p_loc;
        a.strength = pinit[c].p_str;
        a.flags = { gender: pinit[c].p_sex };
        a.weaponId = null;
        user.player.visibility = 0;
        a.level = pinit[c].p_lev;
        a++;c++;
    }
    while(a<48)
    {
        strcpy(pname(a),"");
        a++;
    }
}

PLAYER pinit[48]=
    { "The Wraith",-1077,60,0,-2,"Shazareth",-1080,99,0,-30,"Bomber",-308,50,0,-10,
    "Owin",-311,50,0,-11,"Glowin",-318,50,0,-12,
    "Smythe",-320,50,0,-13
    ,"Dio",-332,50,0,-14
    ,"The Dragon",-326,500,0,-2,"The Zombie",-639,20,0,-2
    ,"The Golem",-1056,90,0,-2,"The Haggis",-341,50,0,-2,"The Piper"
    ,-630,50,0,-2,"The Rat",-1064,20,0,-2
    ,"The Ghoul",-129,40,0,-2,"The Figure",-130,90,0,-2,
    "The Ogre",-144,40,0,-2,"Riatha",-165,50,0,-31,
    "The Yeti",-173,80,0,-2,"The Guardian",-197,50,0,-2
    ,"Prave",-201,60,0,-400,"Wraith",-350,60,0,-2
,"Bath",-1,70,0,-401,"Ronnie",-809,40,0,-402,"The Mary",-1,50,0,-403,
"The Cookie",-126,70,0,-404,"MSDOS",-1,50,0,-405,
"The Devil",-1,70,0,-2,"The Copper"
,-1,40,0,-2
};



wearcom()
{
    long a,b;
    extern long mynum;
    b=ohereandget(&a);
    if(b== -1) return(-1);
    if(!iscarrby(a,mynum))
    {
        bprintf("You are not carrying this\n");
        return;
    }
    if(iswornby(a,mynum))
    {
        bprintf("You are wearing this\n");
        return;
    }
    if(((iswornby(89,mynum))||(iswornby(113,mynum))||(iswornby(114,mynum)))&&
        ((a==89)||(a==113)||(a==114)))
    {
        bprintf("You can't use TWO shields at once...\n");
        return;
    }
    if(!canwear(a))
    {
        bprintf("Is this a new fashion ?\n");
        return;
    }
    setcarrf(a,2);
    bprintf("OK\n");
}

removecom()
{
    long a,b;
    extern long mynum;
    b=ohereandget(&a);
    if(b== -1) return;
    if(!iswornby(a,mynum))
    {
        bprintf("You are not wearing this\n");
    }
    setcarrf(a,1);
}

setcarrf(o,n)
{
    extern long objinfo[];
    objinfo[4*o+3]=n;
}

iswornby(item,chr)
{
    if(!iscarrby(item,chr)) return(0);
    if(item.carryFlag != IS_WEARING_BY) return(0);
    return(1);
}

addforce(x)
char *x;
{
    extern char acfor[];
    extern long forf;
    if(forf==1)bprintf("The compulsion to %s is overridden\n",acfor);
    forf=1;
    strcpy(acfor,x);
}

long forf=0;
char acfor[128];

forchk()
{
    extern long forf;
    extern char acfor[];
    extern long isforce;
    isforce=1;
    if(forf==1) gamecom(acfor);
    isforce=0;
    forf=0;
}

long isforce=0;
damof(n)
{
    switch(n)
    {
        case 20:
        case 18:;
        case 19:;
        case 21:;
        case 22:;
            return(6);
        case 23:
            return(32);
        case 24:
            return(8);
        case 28:
            return(6);
        case 30:return(20);
        case 31:return(14);
        case 32:return(15);
        case 33:return(10);
        default:
            return(10);
    }
}
canwear(a)
{
    switch(a)
    {
        default:
            if(a.flags.canWear) return(1);
            return(0);
    }
}
iam(x)
char *x;
{
    char a[64],b[64];
    extern char globme[];
    strcpy(a,x);
    strcpy(b,globme);
    lowercase(a);
    lowercase(b);
    if(!strcmp(a,b)) return(1);
    if(strncmp(b,"the ",4)==0)
    {
        if(!strcmp(a,b+4)) return(1);
    }
    return(0);
}
deafcom()
{
    long a,b;
    extern long mynum,curch;
    extern char globme[64];
    b=victim(&a);
    if(b== -1) return;
    sendsys(pname(a),globme,-10120,curch,"");
}

blindcom()
{
    long a,b;
    extern long mynum,curch;
    extern char globme[64];
    b=victim(&a);
    if(b== -1) return;
    sendsys(pname(a),globme,-10105,curch,"");
}

teletrap(newch)
long newch;
{
    extern long curch;
    char block[200];
    sprintf(block, "%s", visual(user.name, '${user.name} has left.\n'));
            await sendGlobalMessage(
                user.name,
                user.locationId,
                block,
            );
    curch=newch;
    sprintf(block,"%s", visual(user.name, '${user.name} has arrived.\n');
            await sendGlobalMessage(
                user.name,
                newch,
                block,
            );
    await setLocationId(curch, brief);
}

on_flee_event()
{
    extern long  numobs;
    extern long mynum;
    long ct=0;
    while(ct<numobs)
    {
        if((iscarrby(ct,mynum))&&(!iswornby(ct,mynum)))
        {
            ct.setLocation(ct,players[mynum].locationId, IS_LOCATED_AT);
        }
        ct++;
    }
}
*/