// Review Write Component
// Allows users to submit reviews and displays them
// Uses localStorage for persistence
// Usage: insertReviewWrite('#target', { storageKey: 'article-gym', title: 'Share Your Experience' })

(function () {
    'use strict';

    if (!document.getElementById('review-write-styles')) {
        var style = document.createElement('style');
        style.id = 'review-write-styles';
        style.textContent = [
            '.review-write {',
            '    border-top: 3px solid #aa1313;',
            '    padding-top: 20px;',
            '    margin: 40px 0;',
            '}',
            '.review-write-heading {',
            '    font-family: "Oswald", "Arial", sans-serif;',
            '    font-weight: bold;',
            '    font-size: 1.4rem;',
            '    text-transform: uppercase;',
            '    letter-spacing: 0.5px;',
            '    margin: 0 0 16px;',
            '    color: #111;',
            '}',
            '.review-write-list {',
            '    margin-bottom: 24px;',
            '}',
            '.review-write-entry {',
            '    border-left: 2px solid #aa1313;',
            '    padding: 8px 16px;',
            '    margin-bottom: 14px;',
            '}',
            '.review-write-entry-text {',
            '    font-family: "Times New Roman", Times, serif;',
            '    font-weight: bold;',
            '    font-size: 0.97rem;',
            '    line-height: 1.6;',
            '    margin: 0 0 6px;',
            '}',
            '.review-write-entry-attr {',
            '    font-family: "Times New Roman", Times, serif;',
            '    font-size: 0.85rem;',
            '    color: #555;',
            '    margin: 0;',
            '}',
            '.review-write-form {',
            '    display: flex;',
            '    flex-direction: column;',
            '    gap: 10px;',
            '}',
            '.review-write-name,',
            '.review-write-textarea {',
            '    font-family: "Times New Roman", Times, serif;',
            '    font-size: 0.95rem;',
            '    border: 1px solid #ccc;',
            '    border-radius: 4px;',
            '    padding: 8px 12px;',
            '    width: 100%;',
            '    box-sizing: border-box;',
            '    outline: none;',
            '}',
            '.review-write-name:focus,',
            '.review-write-textarea:focus {',
            '    border-color: #aa1313;',
            '}',
            '.review-write-textarea {',
            '    min-height: 90px;',
            '    resize: vertical;',
            '}',
            '.review-write-submit {',
            '    align-self: flex-start;',
            '    background-color: #aa1313;',
            '    color: white;',
            '    font-family: "Oswald", "Arial", sans-serif;',
            '    font-weight: bold;',
            '    font-size: 0.9rem;',
            '    text-transform: uppercase;',
            '    letter-spacing: 0.05em;',
            '    border: none;',
            '    border-radius: 4px;',
            '    padding: 9px 22px;',
            '    cursor: pointer;',
            '}',
            '.review-write-submit:hover {',
            '    background-color: #8a0f0f;',
            '}',
            '.review-write-empty {',
            '    font-family: "Times New Roman", Times, serif;',
            '    font-size: 0.9rem;',
            '    color: #999;',
            '    margin-bottom: 16px;',
            '}'
        ].join('\n');
        document.head.appendChild(style);
    }

    function getReviews(storageKey) {
        try {
            return JSON.parse(localStorage.getItem(storageKey) || '[]');
        } catch (e) {
            return [];
        }
    }

    function saveReview(storageKey, review) {
        var reviews = getReviews(storageKey);
        reviews.unshift(review);
        localStorage.setItem(storageKey, JSON.stringify(reviews));
    }

    function renderList(reviews) {
        if (reviews.length === 0) {
            return '<div class="review-write-list"><p class="review-write-empty">No reviews yet. Be the first!</p></div>';
        }
        var items = reviews.map(function (r) {
            return '<div class="review-write-entry">' +
                '<p class="review-write-entry-text">\u201c' + r.text + '\u201d</p>' +
                (r.name ? '<p class="review-write-entry-attr">\u2014 ' + r.name + '</p>' : '') +
                '</div>';
        }).join('');
        return '<div class="review-write-list">' + items + '</div>';
    }

    function createReviewWrite(config) {
        var storageKey = config.storageKey || 'review-write-default';
        var heading = config.title || 'Leave a Review';
        var reviews = getReviews(storageKey);

        return '<div class="review-write" data-storage-key="' + storageKey + '">' +
            '<p class="review-write-heading">' + heading + '</p>' +
            renderList(reviews) +
            '<form class="review-write-form">' +
            '<input class="review-write-name" type="text" placeholder="Your name (optional)" maxlength="80">' +
            '<textarea class="review-write-textarea" placeholder="Write your review..." maxlength="600"></textarea>' +
            '<button class="review-write-submit" type="submit">Submit</button>' +
            '</form>' +
            '</div>';
    }

    function bindEvents(container) {
        var form = container.querySelector('.review-write-form');
        var storageKey = container.querySelector('.review-write').getAttribute('data-storage-key');

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var nameEl = form.querySelector('.review-write-name');
            var textEl = form.querySelector('.review-write-textarea');
            var text = textEl.value.trim();
            if (!text) return;

            saveReview(storageKey, { name: nameEl.value.trim(), text: text });

            var list = container.querySelector('.review-write-list');
            list.outerHTML = renderList(getReviews(storageKey));

            nameEl.value = '';
            textEl.value = '';
        });
    }

    function insertReviewWrite(selector, config) {
        var target = document.querySelector(selector);
        if (!target) return;
        target.innerHTML = createReviewWrite(config);
        bindEvents(target);
    }

    window.createReviewWrite = createReviewWrite;
    window.insertReviewWrite = insertReviewWrite;
})();
