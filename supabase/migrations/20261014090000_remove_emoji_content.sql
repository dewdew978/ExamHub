-- Remove emoji from blog content/author avatars and exam icons (the UI now uses line icons and initials).

update public.blogs set
  content = regexp_replace(content, '[\U0001F300-\U0001FAFF☀-➿⭐]️?[ ]?', '', 'g'),
  title = regexp_replace(title, '[\U0001F300-\U0001FAFF☀-➿⭐]️?[ ]?', '', 'g'),
  description = regexp_replace(coalesce(description, ''), '[\U0001F300-\U0001FAFF☀-➿⭐]️?[ ]?', '', 'g'),
  author_avatar = '';

update public.exams set icon = ''
where icon ~ '[\U0001F300-\U0001FAFF☀-➿]';
