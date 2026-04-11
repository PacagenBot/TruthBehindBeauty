// Comments Component
// Renders seeded editorial comments + user-submitted comments (localStorage)
// Usage: insertReviewWrite('#target', { storageKey: 'article-key', comments: [...] })
// Each seeded comment: { name, date, text, initial, color, isTBB, replies: [{...}] }

(function () {
    'use strict';

    if (!document.getElementById('review-write-styles')) {
        var style = document.createElement('style');
        style.id = 'review-write-styles';
        style.textContent = [
            '.tbb-comments-section { margin-top: 3rem; padding-top: 2rem; border-top: 2px solid #eee; }',
            '.tbb-comments-heading { font-family: \'Oswald\', \'Arial\', sans-serif; font-size: 2rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1.5rem; color: #111; }',
            '.tbb-comments-count { display: inline-block; background: #c62828; color: #fff; font-size: 0.75rem; border-radius: 999px; padding: 1px 8px; margin-left: 6px; vertical-align: middle; }',
            '.tbb-comment { display: flex; gap: 0.85rem; margin-bottom: 1.5rem; align-items: flex-start; }',
            '.tbb-comment-reply { margin-left: 3rem; }',
            '.tbb-comment-avatar { width: 36px; height: 36px; border-radius: 50%; background-color: #c62828; color: #fff; display: flex; align-items: center; justify-content: center; font-family: Arial, sans-serif; font-weight: 700; font-size: 0.9rem; flex-shrink: 0; }',
            '.tbb-avatar-tbb { background-color: #111 !important; }',
            '.tbb-comment-body { flex: 1; }',
            '.tbb-comment-meta { display: flex; gap: 0.75rem; align-items: baseline; margin-bottom: 0.3rem; }',
            '.tbb-comment-name { font-family: Arial, sans-serif; font-weight: 700; font-size: 0.85rem; color: #111; }',
            '.tbb-name-tbb { color: #c62828 !important; }',
            '.tbb-comment-date { font-family: Arial, sans-serif; font-size: 0.75rem; color: #999; }',
            '.tbb-comment-body p { font-family: Arial, sans-serif; font-size: 0.9rem; color: #333; line-height: 1.6; margin: 0 0 0.4rem; }',
            '.tbb-comment-reply-btn { background: none; border: none; cursor: pointer; font-size: 0.78rem; color: #999; font-family: Arial, sans-serif; padding: 0; transition: color 0.2s; }',
            '.tbb-comment-reply-btn:hover { color: #c62828; }',
            '.tbb-comment-form { margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #eee; display: flex; flex-direction: column; gap: 0.75rem; }',
            '.tbb-comment-form-heading { font-family: Arial, sans-serif; font-size: 0.95rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #111; margin: 0; }',
            '.tbb-comment-input { border: 1px solid #ddd; border-radius: 4px; padding: 8px 12px; font-size: 0.9rem; font-family: Arial, sans-serif; outline: none; width: 100%; box-sizing: border-box; }',
            '.tbb-comment-textarea { border: 1px solid #ddd; border-radius: 4px; padding: 10px 12px; font-size: 0.9rem; font-family: Arial, sans-serif; outline: none; width: 100%; min-height: 100px; resize: vertical; box-sizing: border-box; }',
            '.tbb-comment-input:focus, .tbb-comment-textarea:focus { border-color: #c62828; }',
            '.tbb-comment-submit { align-self: flex-start; background-color: #c62828; color: #fff; border: none; border-radius: 4px; padding: 9px 22px; font-size: 0.88rem; font-weight: 700; font-family: Arial, sans-serif; cursor: pointer; transition: background-color 0.2s; }',
            '.tbb-comment-submit:hover { background-color: #a62020; }',
            '.tbb-user-comment { border-left: 2px solid #eee; padding-left: 0.75rem; }',
        ].join('\n');
        document.head.appendChild(style);
    }

    function getInitial(name) {
        return (name || '?').charAt(0).toUpperCase();
    }

    function getStoredComments(storageKey) {
        try { return JSON.parse(localStorage.getItem(storageKey) || '[]'); } catch (e) { return []; }
    }

    function saveComment(storageKey, comment) {
        var list = getStoredComments(storageKey);
        list.push(comment);
        localStorage.setItem(storageKey, JSON.stringify(list));
    }

    function renderSeededComment(c, isReply) {
        var replyClass = isReply ? ' tbb-comment-reply' : '';
        var avatarClass = c.isTBB ? ' tbb-avatar-tbb' : '';
        var nameClass = c.isTBB ? ' tbb-name-tbb' : '';
        var avatarStyle = (!c.isTBB && c.color) ? ' style="background-color:' + c.color + ';"' : '';
        var repliesHTML = '';
        if (!isReply && c.replies && c.replies.length) {
            repliesHTML = c.replies.map(function (r) { return renderSeededComment(r, true); }).join('');
        }
        return '<div class="tbb-comment' + replyClass + '">' +
            '<div class="tbb-comment-avatar' + avatarClass + '"' + avatarStyle + '>' + (c.initial || getInitial(c.name)) + '</div>' +
            '<div class="tbb-comment-body">' +
            '<div class="tbb-comment-meta">' +
            '<span class="tbb-comment-name' + nameClass + '">' + (c.name || '') + '</span>' +
            '<span class="tbb-comment-date">' + (c.date || '') + '</span>' +
            '</div>' +
            '<p>' + (c.text || '') + '</p>' +
            '<button class="tbb-comment-reply-btn">\u21a9 Reply</button>' +
            '</div></div>' + repliesHTML;
    }

    function renderStoredComment(c) {
        var today = new Date();
        var dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        return '<div class="tbb-comment tbb-user-comment">' +
            '<div class="tbb-comment-avatar" style="background-color:#555;">' + getInitial(c.name) + '</div>' +
            '<div class="tbb-comment-body">' +
            '<div class="tbb-comment-meta">' +
            '<span class="tbb-comment-name">' + (c.name || 'Anonymous') + '</span>' +
            '<span class="tbb-comment-date">' + dateStr + '</span>' +
            '</div>' +
            '<p>' + c.text + '</p>' +
            '<button class="tbb-comment-reply-btn">\u21a9 Reply</button>' +
            '</div></div>';
    }

    function renderCommentsList(seeded, stored) {
        var html = seeded.map(function (c) { return renderSeededComment(c, false); }).join('');
        html += stored.map(function (c) { return renderStoredComment(c); }).join('');
        return html;
    }

    function createReviewWrite(config) {
        var storageKey = config.storageKey || 'tbb-comments-default';
        var seeded = config.comments || [];
        var stored = getStoredComments(storageKey);
        var total = seeded.length + stored.length;
        // Count replies too
        seeded.forEach(function (c) { if (c.replies) total += c.replies.length; });

        return '<div class="tbb-comments-section" data-storage-key="' + storageKey + '">' +
            '<h3 class="tbb-comments-heading">Comments <span class="tbb-comments-count">' + total + '</span></h3>' +
            '<div class="tbb-comments-list">' + renderCommentsList(seeded, stored) + '</div>' +
            '<div class="tbb-comment-form">' +
            '<h4 class="tbb-comment-form-heading">Leave a Comment</h4>' +
            '<input type="text" class="tbb-comment-input" placeholder="Your name">' +
            '<textarea class="tbb-comment-textarea" placeholder="Share your thoughts..."></textarea>' +
            '<button class="tbb-comment-submit">Post Comment</button>' +
            '</div></div>';
    }

    function bindEvents(container, config) {
        var storageKey = config.storageKey || 'tbb-comments-default';
        var seeded = config.comments || [];
        var btn = container.querySelector('.tbb-comment-submit');
        if (!btn) return;
        btn.addEventListener('click', function () {
            var nameEl = container.querySelector('.tbb-comment-input');
            var textEl = container.querySelector('.tbb-comment-textarea');
            var text = (textEl.value || '').trim();
            if (!text) return;
            var comment = { name: (nameEl.value || '').trim() || 'Anonymous', text: text };
            saveComment(storageKey, comment);
            var stored = getStoredComments(storageKey);
            var total = seeded.length + stored.length;
            seeded.forEach(function (c) { if (c.replies) total += c.replies.length; });
            container.querySelector('.tbb-comments-count').textContent = total;
            container.querySelector('.tbb-comments-list').innerHTML = renderCommentsList(seeded, stored);
            nameEl.value = '';
            textEl.value = '';
        });
    }

    function insertReviewWrite(selector, config) {
        var target = document.querySelector(selector);
        if (!target) return;
        target.innerHTML = createReviewWrite(config);
        bindEvents(target, config);
    }

    window.createReviewWrite = createReviewWrite;
    window.insertReviewWrite = insertReviewWrite;
})();
