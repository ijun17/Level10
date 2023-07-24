class MagicSkill{
    name="";
    requiredMP=0;
    requiredLevel;
    cooltime=0;
    isBasic;
    error;
    errorMessageList=[];
    code;
    primitiveCode="";
    constructor(name="", code=function(){}, cooltime=0, requiredMP=0, requiredLevel=0, isBasic=true){
        this.name=name;
        this.code=code;
        this.requiredMP=requiredMP;
        this.cooltime=cooltime;
        this.requiredLevel=requiredLevel;
        this.isBasic=isBasic
    }
    cast(caster){
        this.code(caster);
    }
    getRequiredMP(){return this.requiredMP}
    getCoolTime(){return this.cooltime}
    getRequiredLevel(){return this.requiredLevel}
    getPrimitiveCode(){return this.primitiveCode;}
    setPrimitiveCode(pCode){this.primitiveCode=pCode;}
    setErrorMessageList(e){this.errorMessageList=e;}
}