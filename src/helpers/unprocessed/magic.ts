/*
#include <stdio.h>
#include "files.h"

extern long curch;
extern long mynum;
extern long my_lev;
extern char globme[];
extern char wordbuf[];
extern char *pname();
extern FILE *openroom();
extern FILE *openuaf();

sumcom()
    {
    long a,b;
    extern char wordbuf[];
    extern long curch,mynum;
    extern long my_lev;
    extern char globme[];
    char seg[128];
    char mes[128];
    char ms[128];
    long c,d,x;
    if(brkword()== -1)
       {
       bprintf("Summon who ?\n");
       return;
       }
    a=fobn(wordbuf);
    if(a!= -1) goto sumob;
    a = await world.findVisiblePlayerByName(wordbuf, user, user.isBlind);
    if(a== -1)
       {
       bprintf("I dont know who that is\n");
       return;
       }
    if(user.data.strength < 10)
       {
       bprintf("You are too weak\n");
       return;
       }
    if(my_lev<10)user.data.strength -= 2;
    c=my_lev*2;
    if(my_lev>9) c=101;
if(iscarrby(111,mynum)) c+=my_lev;
if(iscarrby(121,mynum)) c+=my_lev;
if(iscarrby(163,mynum)) c+=my_lev;
    d = randomizer();
    if(my_lev>9) goto willwork;
    if((iswornby(90,a))||(c<d))
       {
       bprintf("The spell fails....\n");
       return;
       }
    if((a == await world.findVisiblePlayerByName('wraith', user, user.isBlind))||((iscarrby(32,a))||(iscarrby(159,a))||iscarrby(174,a)))
       {
       bprintf("Something stops your summoning from succeeding\n");
       return;
       }
    if(a==mynum)
       {
       bprintf("Seems a waste of effort to me....\n");
       return;
       }
    if((curch>=-1082)&&(curch<=-1076))
       {
       bprintf("Something about this place makes you fumble the magic\n");
       return;
       }
willwork:bprintf("You cast the summoning......\n");
    if(a<16)
       {
       sendsys(pname(a),globme,-10020,curch,"");
       return;
       }
    if((a==17)||(a==23)) return;
    dumpstuff(a,a.locationId);
    sprintf(seg, visual(pname(a), '${pname(a)} has arrived\n'));
            await sendGlobalMessage(
                null,
                user.locationId,
                seg,
            );
    a.locationId = user.locationId;
    return;
    sumob:;
    if(my_lev<10)
       {
       bprintf("You can only summon people\n");
       return;
       }
    x=a.locationId;
    if(a.carryFlag > IS_LOCATED_AT) x = x.locationId;
    sprintf(ms,"${ifPlayer(user.name)} has summoned the %s\n",a.name);
            await sendGlobalMessage(
                user.name,
                x,
                ms,
            );
    bprintf("The %s flies into your hand ,was ",a.name);
    desrm(a.locationId, a.carryFlag);
    a.setLocation(user.playerId, IS_CARRIED_BY);
    }

 delcom()
    {
    extern long my_lev;
    extern char wordbuf[];
    if(my_lev<11)
       {
       bprintf("What ?\n");
       return;
       }
    if(brkword()== -1)
       {
       bprintf("Who ?\n");
       return;
       }
    if(delu2(wordbuf)== -1)bprintf("failed\n");
    }

 passcom()
    {
    extern char globme[];
    chpwd(globme);
    }

 goloccom()
    {
    extern long curch,my_lev;
    extern char globme[];
    char n1[128];
    char bf[128];
    extern char mout_ms[],min_ms[];
    extern char wordbuf[];
    long a;
    FILE *b;
    if(my_lev<10)
       {
       bprintf("huh ?\n");
       return;
       }
    if(brkword()== -1)
       {
       bprintf("Go where ?\n");
       return;
       }
    strcpy(n1,wordbuf);
    if(brkword()== -1) strcpy(wordbuf,"");
    a=roomnum(n1,wordbuf);
    if((a>=0)||((b=openroom(a,"r"))==0))
       {
       bprintf("Unknown Room\n");
       return;
       }
    fclose(b);
    sprintf(bf,visual(%s, '%s ${mout_ms}\n'));
    sillycom(bf);
    curch=a;
    await setLocationId(curch, brief);
    sprintf(bf,visual(%s, '%s ${min_ms}\n'));
    sillycom(bf);
    }




 wizcom()
    {
    extern long my_lev;
    extern char globme[],wordbuf[];
    extern long curch;
    char bf[128];
    if(my_lev<10)
       {
       bprintf("Such advanced conversation is beyond you\n");
       return;
       }
    getreinput(wordbuf);
    sprintf(bf,"${ifPlayer(user.name)} : %s\n",wordbuf);
    await sendAdminMessage(
        user.name,
        user.locationId,
        bf,
    );
    return {
      newEvents: true,
    }
    }

 viscom()
    {
    long f;
    extern long my_lev;
    extern long mynum;
    extern char globme[];
    long ar[4];
    if(my_lev<10)
       {
       bprintf("You can't just do that sort of thing at will you know.\n");
       return;
       }
    if(!user.player.visibility)
       {
       bprintf("You already are visible\n");
       return;
       }
    user.player.visibility = 0;
    ar[0]=mynum;
    ar[1] = user.player.visibility;
    sendsys("","",-9900,0,ar);
    bprintf("Ok\n");
    sillycom(visual(%s, '%s suddenely appears in a puff of smoke\n'));
    }

 inviscom()
    {
    extern long mynum,my_lev;
    extern char globme[];
    extern char wordbuf[];
    long f,x;
    long ar[4];
    if(my_lev<10)
       {
       bprintf("You can't just turn invisible like that!\n");
       return;
       }
    x=10;
    if(my_lev>9999) x=10000;
    if((my_lev==10033)&&(brkword()!=-1)) x=numarg(wordbuf);
    if(user.player.visibility === x)
       {
       bprintf("You are already invisible\n");
       return;
       }
    user.player.visibility = x;
    ar[0]=mynum;
    ar[1]=user.player.visibility;
    sendsys("","",-9900,0,ar);
    bprintf("Ok\n");
    sillycom(light("%s vanishes!\n"));
    }

 ressurcom()
    {
    extern long my_lev;
    long bf[32];
    extern long curch;
    long a,b;
    extern char wordbuf[];
    if(my_lev<10)
       {
       bprintf("Huh ?\n");
       return;
       }
    if(brkword()== -1)
       {
       bprintf("Yes but what ?\n");
       return;
       }
    a=fobn(wordbuf);
    if(a== -1)
       {
       bprintf("You can only ressurect objects\n");
       return;
       }
    if(!a.flags.isDestroyed){
       bprintf("That already exists\n");
       return;
       }
    a.flags.isDestroyed = false;
    a.setLocation(user.locationId, IS_LOCATED_AT);
    sprintf(bf,"The %s suddenly appears\n",a.name);
            await sendGlobalMessage(
                null,
                user.locationId,
                bf,
            );
    }

 */
