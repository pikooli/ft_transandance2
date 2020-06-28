import consumer from "./consumer"
import {popWindows,popChoise, popChoise2} from '../popWindows/popWindows'


var subGuild;

export function subscGuild()
{
  var anagram = $('#anagram').html();
  
  if(anagram){
    anagram = anagram.substring(1, anagram.length - 1)

    if(subGuild){
        if (subGuild.identifier != '{"channel":"GuildChannel","guildanagram":"'+ anagram + '"}'){
            subGuild.unsubscribe()
            subGuild = subscribeguild(anagram)        
        }
    }
    else
    subGuild = subscribeguild(anagram)
  }
}

function subscribeguild(anagram){

        return consumer.subscriptions.create({channel: "GuildChannel", guildanagram: anagram}, {
          connected() {},
          disconnected() {
          },
          received(data) {        
            if (data.addon)
              proposewar(data);
            if (data.content)
              popWindows(data.content)
            if (data.war){
              
              var newdata = data.data

              newdata["opponent"] = $('#playerUsername').html()
              newdata["challenger"] = data.challenger
              newdata["authenticity_token"] = document.getElementsByName('csrf-token')[0].content;

              popChoise2(data.war, "/guildwars/acceptmatch", newdata)
            }
          }
        });
}



function proposewar(data){
  
  let message 

  if (data.addon === 'false')
    message = '<p>[' + data.guildname + '] declare war to your guild </p><p>betting ' + data.pointbet + ' point</p><p>number of unanwers match in guild war : '
             + data.unanMatch + '</p><p>only duel count for war points</p>'; 
  else
    message = '<p>[' + data.guildname + '] declare war to your guild </p><p>betting ' + data.pointbet + ' point</p><p>number of unanwers match in guild war : '
    + data.unanMatch + '</p><p>all match count for war points</p>';
  popChoise2(message, "guildwars/acceptwar", data);
}