let World={
    PHYSICS_CHANNEL : 0,
    PARTICLE_CHANNEL : 1,
    TEXT_CHANNEL : 3,
    BUTTON_CHANNEL : 2,
    channel:[[],[],[],[]],
    init:function(){
        this.channel=[new EntityManager(true), new EntityManager(false), new EntityManager(true), new EntityManager(false)];
    },
    add:function(entity){this.channel[entity.channelLevel].push(entity)},
    updateWorld:function(){this.allChannelDo(function(l){l.update()});},
    resetWorld:function(){this.allChannelDo(function(l){l.clear()})},
    allChannelDo:function(f){let l=this.channel;f(l[0]);f(l[1]);f(l[2]);f(l[3]);}
}