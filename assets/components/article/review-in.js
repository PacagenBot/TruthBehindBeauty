// Review/Quote Component
// Usage: insertReviewIn('#target', { review: '...', name: 'Jane', title: 'Verified Buyer' })

(function () {
    'use strict';

    if (!document.getElementById('review-in-styles')) {
        var style = document.createElement('style');
        style.id = 'review-in-styles';
        style.textContent = [
            '.review-in {',
            '    border-left: 2px solid #aa1313;',
            '    padding: 10px 18px;',
            '    margin: 28px 0;',
            '}',
            '.review-in-text {',
            '    font-weight: bold;',
            '    font-size: 1rem;',
            
            '    line-height: 1.65;',
            '    margin: 0 0 8px;',
            '    font-family: "Times New Roman", Times, serif;',
            '}',
            '.review-in-attr {',
            '    font-size: 0.9rem;',
            '    color: #555;',
            '    margin: 0;',
            '    font-family: "Times New Roman", Times, serif;',
            '}'
        ].join('\n');
        document.head.appendChild(style);
    }

    function createReviewIn(config) {
        var review = config.review || '';
        var name = config.name || '';
        var title = config.title || '';

        if (!review) return '';

        var attr = '';
        if (name || title) {
            attr = '\u2014 ' + [name, title].filter(Boolean).join(', ');
        }

        return '<div class="review-in">' +
            '<p class="review-in-text">\u201c' + review + '\u201d</p>' +
            (attr ? '<p class="review-in-attr">' + attr + '</p>' : '') +
            '</div>';
    }

    function insertReviewIn(selector, config) {
        var target = document.querySelector(selector);
        if (target) {
            target.innerHTML = createReviewIn(config);
        }
    }

    window.createReviewIn = createReviewIn;
    window.insertReviewIn = insertReviewIn;
})();
