const HelpSystem = {
    currentSection: 'basics',
    searchTimeout: null,

    init() {
        this.bindNavigation();
        this.bindAccordion();
        this.bindSearch();
        this.bindKeyboard();
        this.highlightMatchingContent();
    },

    bindNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.switchSection(section);
            });
        });
    },

    switchSection(sectionId) {
        const navItems = document.querySelectorAll('.nav-item');
        const sections = document.querySelectorAll('.content-section');

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.section === sectionId) {
                item.classList.add('active');
            }
        });

        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === sectionId + '-section') {
                section.classList.add('active');
            }
        });

        this.currentSection = sectionId;
        this.clearSearch();
    },

    bindAccordion() {
        const accordionHeaders = document.querySelectorAll('.accordion-header');
        accordionHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const item = header.parentElement;
                const isOpen = item.classList.contains('open');

                document.querySelectorAll('.accordion-item').forEach(i => {
                    i.classList.remove('open');
                });

                if (!isOpen) {
                    item.classList.add('open');
                }
            });
        });
    },

    bindSearch() {
        const searchInput = document.getElementById('help-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                clearTimeout(this.searchTimeout);
                this.searchTimeout = setTimeout(() => {
                    this.performSearch(e.target.value);
                }, 300);
            });

            searchInput.addEventListener('focus', () => {
                this.showSearchHints();
            });
        }
    },

    performSearch(query) {
        if (!query || query.trim() === '') {
            this.clearSearch();
            return;
        }

        const searchTerm = query.toLowerCase().trim();
        const allContent = document.querySelectorAll('.content-section');
        const navItems = document.querySelectorAll('.nav-item');

        let foundSections = new Set();

        allContent.forEach(section => {
            const text = section.textContent.toLowerCase();
            const elements = section.querySelectorAll('p, li, td, th, .step-desc, .factor-desc, .answer-text, .tip-content');

            let sectionHasMatch = false;

            elements.forEach(el => {
                if (el.textContent.toLowerCase().includes(searchTerm)) {
                    el.style.backgroundColor = '#FFF3CD';
                    el.style.padding = '2px 4px';
                    el.style.borderRadius = '3px';
                    sectionHasMatch = true;
                } else {
                    el.style.backgroundColor = '';
                    el.style.padding = '';
                    el.style.borderRadius = '';
                }
            });

            const title = section.querySelector('.section-title');
            if (title && title.textContent.toLowerCase().includes(searchTerm)) {
                sectionHasMatch = true;
            }

            if (sectionHasMatch) {
                foundSections.add(section.id.replace('-section', ''));
            }
        });

        navItems.forEach(item => {
            const section = item.dataset.section;
            if (foundSections.has(section)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });

        if (foundSections.size > 0) {
            const firstSection = foundSections.values().next().value;
            this.switchSection(firstSection);
        }
    },

    clearSearch() {
        const searchInput = document.getElementById('help-search');
        if (searchInput) {
            searchInput.value = '';
        }

        document.querySelectorAll('.content-section').forEach(section => {
            const elements = section.querySelectorAll('p, li, td, th, .step-desc, .factor-desc, .answer-text, .tip-content');
            elements.forEach(el => {
                el.style.backgroundColor = '';
                el.style.padding = '';
                el.style.borderRadius = '';
            });
        });

        document.querySelectorAll('.nav-item').forEach(item => {
            item.style.display = 'flex';
        });
    },

    showSearchHints() {
        const searchInput = document.getElementById('help-search');
        if (searchInput && searchInput.value === '') {
            searchInput.placeholder = '搜索配方、材料、任务...';
        }
    },

    highlightMatchingContent() {
        const urlParams = new URLSearchParams(window.location.search);
        const highlight = urlParams.get('highlight');
        if (highlight) {
            this.performSearch(highlight);
        }
    },

    bindKeyboard() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeHelp();
            }

            if (e.key >= '1' && e.key <= '6') {
                const sections = ['basics', 'recipes', 'materials', 'tutorial', 'faq', 'tips'];
                const index = parseInt(e.key) - 1;
                if (index < sections.length) {
                    this.switchSection(sections[index]);
                }
            }

            if (e.key === '/' || e.key === 'f') {
                e.preventDefault();
                const searchInput = document.getElementById('help-search');
                if (searchInput) {
                    searchInput.focus();
                }
            }
        });
    },

    openHelp() {
        window.location.href = 'help.html';
    },

    closeHelp() {
        if (window.opener) {
            window.close();
        } else {
            window.history.back();
        }
    }
};

function searchHelp() {
    HelpSystem.performSearch(document.getElementById('help-search').value);
}

function switchHelpSection(sectionId) {
    HelpSystem.switchSection(sectionId);
}

function closeHelp() {
    window.history.back();
}

document.addEventListener('DOMContentLoaded', function() {
    HelpSystem.init();

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const section = this.dataset.section;
            switchHelpSection(section);
        });
    });

    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const item = this.parentElement;
            const isOpen = item.classList.contains('open');

            document.querySelectorAll('.accordion-item').forEach(i => {
                i.classList.remove('open');
            });

            if (!isOpen) {
                item.classList.add('open');
            }
        });
    });

    const searchInput = document.getElementById('help-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchHelp();
        });

        searchInput.addEventListener('focus', function() {
            this.placeholder = '搜索配方、材料、任务...';
        });

        searchInput.addEventListener('blur', function() {
            if (this.value === '') {
                this.placeholder = '搜索问题...';
            }
        });
    }
});
