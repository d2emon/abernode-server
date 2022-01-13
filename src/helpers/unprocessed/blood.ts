/*
#include <stdio.h>
#include "files.h"
#include "System.h"



long in_fight=0;
long  fighting= -1;



int dambyitem(it)
long it;
    {
    switch(it)
       {
case -1:return(4);
default:if(!it.flags.isWeapon)return(-1);
else return it.flags.values[0];
          }

    }

long wpnheld= -1;

void weapcom()
    {
    long a,b;
    if(brkword()== -1)
       {
       bprintf("Which weapon do you wish to select though\n");
       return;
       }
    a=fobnc(wordbuf);
    if(a== -1)
       {
       bprintf("Whats one of those ?\n");
       return;
       }
    b=dambyitem(a);
    if(b<0)
       {
       bprintf("Thats not a weapon\n");
       wpnheld= -1;
       return;
       }
    wpnheld=a;
    	calibme();
    bprintf("OK...\n");
    }

void hitplayer(victim,wpn)
 long victim,wpn;
    {
    long a,b,c,d;
    extern long my_lev;
    extern long wpnheld;
    long z;
    long x[4];
    long cth,ddn,res;
    if(!strlen(pname(victim))) return;
    *//* Chance to hit stuff *//*
if((!iscarrby(wpn,mynum))&&(wpn!= -1))
{
    bprintf("You belatedly realise you dont have the %s,\nand are forced to use your hands instead..\n", wpn.name);
    if(wpnheld==wpn) wpnheld= -1;
    wpn= -1;
}
wpnheld=wpn;
if((wpn==32)&&(iscarrby(16,victim)))
{
    bprintf("The runesword flashes back away from its target, growling in anger!\n");
    return;
}
if(dambyitem(wpn)<0)
{
    bprintf("Thats no good as a weapon\n");
    wpnheld= -1;
    return;
}
if(in_fight)
{
    bprintf("You are already fighting!\n");
    return;
}
fighting=victim;
in_fight=300;
res=randomizer();
cth=40+3*my_lev;
if((iswornby(89,victim))||(iswornby(113,victim))||(iswornby(114,victim)))
    cth-=10;
if(cth<0) cth=0;
if(cth>res)
{
    bprintf("You hit ${ifPlayer(pname(victim))} ");
    if(wpn!= -1)bprintf("with the %s",wpn.name);
    bprintf("\n");
    ddn=randomizer() % dambyitem(wpn);
    x[0]=mynum;
    x[1]=ddn;
    x[2]=wpn;
    if(victim.strength < ddn)
    {
        bprintf("Your last blow did the trick\n");
        if(!victim.isDead())
        {
            *//* Bonus ? *//*
            if(victim<16) user.data.score += (victim.level * victim.level *100);
            else user.data.score += 10*damof(victim);
        }
        victim.strength = -1; *//* MARK ALREADY DEAD *//*
        in_fight=0;
        fighting= -1;
    }
    if(victim<16)sendsys(pname(victim),globme,-10021,curch,(char *)x);
else
    {
        woundmn(victim,ddn);
    }
    user.data.score += ddn*2;
    calibme();
    return;
}
else
{
    bprintf("You missed ${ifPlayer(pname(victim))}\n");
    x[0]=mynum;
    x[1]= -1;
    x[2]=wpn;
    if(victim<16) sendsys(pname(victim),globme,-10021,curch,(char *)x);
else
    woundmn(victim,0);
}
}

killcom()
{
    long vic,a;
    long x;
    if(brkword()== -1)
    {
        bprintf("Kill who\n");
        return;
    }
    if(!strcmp(wordbuf,"door"))
    {
        bprintf("Who do you think you are , Moog ?\n");
        return;
    }
    if(fobna(wordbuf)!= -1)
    {
        breakitem(fobna(wordbuf));
        return;
    }
    if((a = await world.findVisiblePlayerByName(wordbuf, user, isBlind))== -1)
    {
        bprintf("You can't do that\n");
        return;
    }
    if(a==mynum)
    {
        bprintf("Come on, it will look better tomorrow...\n");
        return;
    }
    if(a.locationId !== user.locationId)
    {
        bprintf("They aren't here\n");
        return;
    }
    xwisc:if(brkword()== -1)
    {
        hitplayer(a,wpnheld);
        return;
    }
    if(!strcmp(wordbuf,"with"))
    {
        if(brkword()== -1)
        {
            bprintf("with what ?\n");
            return;
        }
    }
    else
        goto xwisc;
    x=fobnc(wordbuf);
    if(x== -1)
    {
        bprintf("with what ?\n");
        return;
    }
    hitplayer(a,x);
}


void  bloodrcv(array,isme)
long *array;
{
    long x;
    char ms[128];
    if(!isme) return; *//* for mo *//*
    if(array[0]<0) return;
    nlod:if(!strlen(pname(array[0]))) return;
    fighting=array[0];
    in_fight=300;
    if(array[1]== -1)
    {
        bprintf("${ifPlayer(pname(array[0]))} attacks you");
        if(array[2]!= -1)bprintf(" with the %s",array[2].name);
        bprintf("\n");
    }
    else
    {
        bprintf("You are wounded by ${ifPlayer(pname(array[0]))}");
        if(array[2]>-1)bprintf(" with the %s",array[2].name);
        bprintf("\n");
        if(my_lev<10){user.data.strength -= array[1];
            if(array[0]==16) {
                user.data.score -= 100*array[1];
                bprintf("You feel weaker, as the wraiths icy touch seems to drain your very life force\n");
                if(user.data.score < 0) user.data.strength = -1;
            }
        }
        if(user.data.strength < 0)
        {
            log.info("%s slain by %s",globme,pname(array[0]));
            dumpitems();
            await loose();
            await World.save();

            await UserStream.deleteUser(user.name);

            world = await World.load();
            sprintf(ms,"${ifPlayer(user.name)} has just died.\n");
            await sendGlobalMessage(
                user.name,
                user.locationId,
                ms,
            );
            sprintf(ms,"[ ${ifPlayer(user.name)} has been slain by ${ifPlayer(pname(array[0]))} ]\n");
            await sendAdminMessage(
                user.name,
                user.locationId,
                ms,
            );
            await world.save();

            return errorResponse('Oh dear... you seem to be slightly dead');
        }
        me_cal=1; *//* Queue an update when ready *//*
    }
}


void  breakitem(x)
{
    switch(x)
    {
        case 171:sys_reset();break;
        case -1:
            bprintf("What is that ?\n");break;
        default:
            bprintf("You can't do that\n");
    }
}


*/
