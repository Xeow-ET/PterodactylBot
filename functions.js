module.exports={
    calculator: function(num1,operator,num2){
        if(!num1)throw new TypeError("Missing num1")
        if(!operator)throw new TypeError("Missing operator")
        if(!num2)throw new TypeError("Missing num2")
        if(operator=="*")return num1*num2
        if(operator=="^")return num1^num2
        if(operator=="+")return num1+num2
        if(operator=="-")return num1-num2
        if(operator=="/")return num1/num2
    },
    formatDate: function(date){
        return new Intl.DateTimeFormat("en-US").format(date)
    },
    
    promptMessage: async function (message, author, time, validReactions) {
        // We put in the time as seconds, with this it's being transfered to MS
        time *= 1000;

        // For every emoji in the function parameters, react in the good order.
        for (const reaction of validReactions) await message.react(reaction);

        // Only allow reactions from the author, 
        // and the emoji must be in the array we provided.
        const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;

        // And ofcourse, await the reactions
        return message
            .awaitReactions(filter, { max: 1, time: time})
            .then(collected => collected.first() && collected.first().emoji.name);
    }
}