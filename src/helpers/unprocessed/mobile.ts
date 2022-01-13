/*
extern char *pname(  ) ;
*/

import randomizer from "../randomizer";

export const onTimeout = async (): Promise<void> => {
    if (randomizer() > 80) {
        return onlook();
    }
}

/*
onlook(  )
    {
long a ;
extern long mynum ;
chkfight( await world.findPlayerByName( "shazareth" ) ) ;
if( !iscarrby( 45, mynum ) )chkfight( await world.findPlayerByName( "wraith" ) ) ;
chkfight( await world.findPlayerByName( "bomber" ) ) ;
chkfight( await world.findPlayerByName( "owin" ) ) ;
chkfight( await world.findPlayerByName( "glowin" ) ) ;
chkfight( await world.findPlayerByName( "smythe" ) ) ;
chkfight( await world.findPlayerByName( "dio" ) ) ;
if( !iscarrby( 45, mynum ) ) chkfight( await world.findPlayerByName( "zombie" ) ) ;
chkfight( await world.findPlayerByName( "rat" ) ) ;
chkfight( await world.findPlayerByName( "ghoul" ) ) ;
chkfight( await world.findPlayerByName( "ogre" ) ) ;
chkfight( await world.findPlayerByName( "riatha" ) ) ;
chkfight( await world.findPlayerByName( "yeti" ) ) ;
chkfight( await world.findPlayerByName( "guardian"));
if( iscarrby( 32, mynum ) ) dorune(  ) ;
if(user.player.helping !== null) helpchkr();
    }

 chkfight( x )
    {
    extern long curch ;
    extern long mynum ;
    if( x<0 ) return ; *//* No such being *//*
consid_move( x); *//* Maybe move it *//*
if( !strlen( pname( x ) ) ) return ;
if( x.locationId !== user.locationId ) return ;
if(user.player.visibility) return ; *//* Im invis *//*
if(randomizer() > 40) return;
if( ( x == await world.findPlayerByName( "yeti" ) )&& await world.findItem(user.player, (i) => i.flags.isLit))
{
    return ;
}
mhitplayer( x, mynum ) ;
}

consid_move(x)
{;}

crashcom(  )
{
    extern long my_lev ;
    if( my_lev<10 )
    {
        bprintf( "Hmmm....\n" ) ;
        bprintf( "I expect it will sometime\n" ) ;
        return ;
    }
    bprintf( "Bye Bye Cruel World...\n" ) ;
    sendsys( "", "", -666, 0, "" ) ;
    rescom(  ) ;
}

singcom(  )
{
    if( chkdumb(  ) ) return ;
    sillycom( sound(%s, ' sings in Gaelic\n') ) ;
    bprintf( "You sing\n" ) ;
}

spraycom(  )
{
    long a, b ;
    long c ;
    char bk[ 128 ] ;
    extern long wordbuf[  ] ;
    extern long mynum ;
    extern long curch ;
    b=vichere( &a ) ;
    if( b== -1 ) return ;
    if( brkword(  )== -1 )
    {
        bprintf( "With what ?\n" ) ;
        return ;
    }
    if( !strcmp( wordbuf, "with" ) )
    {
        if( brkword(  )== -1 )
        {
            bprintf( "With what ?\n" ) ;
            return ;
        }
    }
    c=fobna( wordbuf ) ;
    if( c== -1 )
    {
        bprintf( "With what ?\n" ) ;
        return ;
    }
    switch( c )
    {
        default:
            bprintf( "You can't do that\n" ) ;
            break ;
    }
    return ;
}

*//* More new stuff *//*

dircom(  )
{
    long a ;
    char b[ 40 ] ;
    char d[ 40 ] ;
    long c ;
    extern long my_lev ;
    extern long numobs ;
    if( my_lev<10 )
    {
        bprintf( "That's a wiz command\n" ) ;
        return ;
    }
    a=0 ;
    while( a<numobs )
    {
        c=findzone( a.locationId, b ) ;
        sprintf( d, "%s%d", b, c ) ;
        if( a.carryFlag !== IS_LOACTED_AT ) strcpy( d, "CARRIED" ) ;
        if( a.carryFlag === IS_CONTAINED_IN ) strcpy( d, "IN ITEM" ) ;
        bprintf( "%-13s%-13s", a.name, d ) ;
        if( a%3==2 )bprintf( "\n" ) ;
        if( a%18==17 ) {
            await g.world.save();
            const messages = await getMessages(bprintf.dirty, bprintf.unfinished);
        };
        a++ ;
    }
    bprintf( "\n" ) ;
}

sys_reset(  )
{
    extern long my_lev ;
    char xx[ 128 ] ;
    FILE *fl ;
    long t, u ;
    if( tscale(  )!=2 )
    {
        bprintf( "There are other people on.... So it wont work!\n" ) ;
        return ;
    }
    time( &t ) ;
    fl = await Stream.openLock(RESET_N, "ruf");
    if(fl==NULL) goto errk;
    fscanf( fl, "%ld", &u ) ;
    fclose(fl ) ;
    if( ( t-u<( 3600 ) )&&( u<t ) )
    {
        bprintf( "Sorry at least an hour must pass between resets\n" ) ;
        return ;
    }
    errk:t=my_lev ;
    my_lev=10 ;
    rescom(  ) ;
    my_lev=t ;
}


dorune(  )
{
    char bf[ 128 ] ;
    long ct ;
    extern long mynum, my_lev, curch ;
    extern long in_fight;
    if(in_fight) return;
    ct=0 ;
    while( ct<32 )
    {
        if( ct==mynum ){ct++ ;continue ;}
        if( !strlen( pname( ct ) ) ) {ct++ ;continue ;}
        if( ct.isAdmin() ) {ct++ ;continue ;}
        if( ct.locationId === user.locationId ) goto hitrune ;
        ct++ ;
    }
    return ;
    hitrune:if( randomizer() < 9*my_lev ) return ;
    if( await world.findPlayerByName( pname( ct ) )== -1 ) return ;
    bprintf( "The runesword twists in your hands lashing out savagely\n" ) ;
    hitplayer(ct,32);
}


pepdrop(  )
{
    long a, b ;
    extern char globme[];
    extern long mynum ;
    extern long curch ;
            await sendGlobalMessage(
                null,
                user.locationId,
                "You start sneezing ATISCCHHOOOOOO!!!!\n",
            );
    if( ( !strlen( pname( 32 ) ) )||( players[32].locationId !== user.locationId ) )
        return ;
    *//* Ok dragon and pepper time *//*
    if( ( iscarrby( 89, mynum ) )&&( items[89].carryFlag === IS_WEARING_BY ) )
    {
        *//* Fried dragon *//*
        strcpy( pname( 32 ), "" ) ; *//* No dragon *//*
        user.data.score += 100 ;
        calibme(  ) ;
        return ;
    }
    else
    {
        *//* Whoops !*//*
        bprintf( "The dragon sneezes forth a massive ball of flame.....\n" ) ;
        bprintf( "Unfortunately you seem to have been fried\n" ) ;
        return await loose('Whoops.....   Frying tonight');
    }
}

dragget(  )
{
    extern long curch, my_lev ;
    long a, b ;
    long l ;
    if( my_lev>9 ) return( 0 ) ;
    l= await world.findPlayerByName( "dragon" ) ;
    if( l== -1 ) return( 0 ) ;
    if( l.locationId !== user.locationId) return( 0 ) ;
    return( 1 ) ;
}

helpchkr()
{
    extern long mynum;
    extern long curch;
    long x = user.player.helping;
    if(!g.user.active) return;
    if(!strlen(pname(x))) goto nhelp;
    if(x.locationId !== user.locationId) goto nhelp;
    return;
    nhelp:bprintf("You can no longer help ${light(pname(x)}\n");
    user.player.helping = null;
}
 */
