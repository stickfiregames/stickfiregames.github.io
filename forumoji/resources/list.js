window.onload = function() {
  // do some promise stuff to make this look better
  $.getJSON('resources/unicode-emoji.json', function(unicodeEmoji) {
    $.getJSON('resources/forumoji.json', function(forumoji) {
      $.getJSON('resources/hidden-emoji.json', function(hiddenEmoji) {
        let emojiList = new Array;

        // unpack and combine the official and forumoji lists
        function unpack(item) {
          if (item.category) {
            $.each(item.contents, function(index, content) {
              unpack(content);
            });
          } else if (item.codepoint && !hiddenEmoji.codepoints.find(c => c == item.codepoint)) {
            emojiList.push(item);
          }
        }

        unpack(unicodeEmoji);

        console.log(forumoji.emoji);

        $.each(forumoji.emoji, function(index, item) {
          let emoji = emojiList.find(e => (e.codepoint == item.codepoint));
          if (emoji) {
            if (emoji.shortcut) {
              // default Scratch emojis
            } else {
              if (emoji.image) {console.log(`duplicate emoji: ${emoji.codepoint} ${emoji.name}`);}

              emoji.image = item.image;
              emoji.url = item.url;
              emoji.author = item.author;
            }
          } else {
            console.log(`failed to find emoji: ${emoji.codepoint} ${emoji.image}`);
          }
        });

        // create tiles for each emoji
        $.each(emojiList, function(index, emoji) {
          if (emoji.image) {
            let tile = document.createElement('img');
            $(tile).attr('src', 'resources/icons/' + emoji.image);
            $(tile).attr('alt', emoji.name);
            $(tile).attr('id', emoji.codepoint);
            $(tile).addClass('author-' + emoji.author.split(' ').join('-'));
            $.each(emoji.keywords, function(index, keyword) {
              $(tile).addClass('keyword-' + keyword.split(' ').join('-'))
            });
            $(tile).click(function() {select(emoji)});
            $('#list').append(tile);
          }
        });

        select(emojiList[Math.floor(Math.random() * emojiList.length)]);
      });
    });
  });
}

function select(emoji) {
  $('.selected').removeClass('selected');
  $('#' + emoji.codepoint).addClass('selected');
  $('#image').attr('src', 'resources/icons/' + emoji.image);
  $('#image').attr('alt', emoji.name);
  $('#name').text(emoji.name);
  $('#author').text(emoji.author);
  $('#keywords').text(emoji.keywords.join(', '));
  $('#bbcode').attr('value', `[img=${emoji.url}]`);
}
