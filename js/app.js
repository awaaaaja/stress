function kasaProApp() {
    return {
        activeTab: 'dashboard',
        paymentType: 'income',
        memberSearch: '',
        reportSearch: '',
        showAddMember: false,
        showMonthDetail: false,
        selectedMonth: null,
        monthDetailTab: 'unpaid',
        isViewOnly: false,

        settings: {
            organizationName: 'Komunitas Kreatif Nusantara',
            activeMonth: 'juni-2025',
            monthlyFee: 50000
        },

        memberForm: {
            id: null,
            name: '',
            phone: '',
            address: '',
            rayon: ''
        },

        incomeForm: {
            type: 'member',
            memberId: '',
            amount: 0,
            method: 'cash',
            months: [],
            description: ''
        },

        installmentForm: {
            memberId: '',
            month: '',
            amount: 0,
            method: 'cash',
            description: ''
        },

        expenseForm: {
            name: '',
            category: '',
            amount: 0,
            description: ''
        },

        reportFilter: {
            month: '',
            year: '',
            status: ''
        },

        members: [
            { id: 1, name: 'Ahmad Rizki', phone: '081234567890', address: 'Jl. Merdeka No. 10', rayon: 'Marketing' },
            { id: 2, name: 'Siti Nurhaliza', phone: '081234567891', address: 'Jl. Sudirman No. 15', rayon: 'Finance' },
            { id: 3, name: 'Budi Santoso', phone: '081234567892', address: 'Jl. Gatot Subroto No. 20', rayon: 'Operations' },
            { id: 4, name: 'Dewi Kusuma', phone: '081234567893', address: 'Jl. Ahmad Yani No. 25', rayon: 'HR' },
            { id: 5, name: 'Eko Prasetyo', phone: '081234567894', address: 'Jl. Diponegoro No. 30', rayon: 'IT' }
        ],

        months: [
            { id: 'januari-2025', name: 'Januari 2025', paidPercentage: 60, installmentPercentage: 20 },
            { id: 'februari-2025', name: 'Februari 2025', paidPercentage: 40, installmentPercentage: 20 },
            { id: 'maret-2025', name: 'Maret 2025', paidPercentage: 70, installmentPercentage: 20 },
            { id: 'april-2025', name: 'April 2025', paidPercentage: 55, installmentPercentage: 20 },
            { id: 'mei-2025', name: 'Mei 2025', paidPercentage: 65, installmentPercentage: 20 },
            { id: 'juni-2025', name: 'Juni 2025', paidPercentage: 20, installmentPercentage: 20 },
            { id: 'juli-2025', name: 'Juli 2025', paidPercentage: 0, installmentPercentage: 0 },
            { id: 'agustus-2025', name: 'Agustus 2025', paidPercentage: 0, installmentPercentage: 0 },
            { id: 'september-2025', name: 'September 2025', paidPercentage: 0, installmentPercentage: 0 },
            { id: 'oktober-2025', name: 'Oktober 2025', paidPercentage: 0, installmentPercentage: 0 },
            { id: 'november-2025', name: 'November 2025', paidPercentage: 0, installmentPercentage: 0 },
            { id: 'desember-2025', name: 'Desember 2025', paidPercentage: 0, installmentPercentage: 0 }
        ],

        transactions: [
            { id: 1, type: 'income', memberId: 1, amount: 50000, method: 'cash', description: 'Iuran Juni 2025 - Ahmad Rizki', date: '2025-06-12' },
            { id: 2, type: 'income', memberId: 2, amount: 100000, method: 'transfer', description: 'Iuran Mei-Juni 2025 - Siti Nurhaliza', date: '2025-06-12' },
            { id: 3, type: 'expense', amount: 75000, category: 'konsumsi', description: 'Konsumsi rapat bulanan', date: '2025-06-12' },
            { id: 4, type: 'installment', memberId: 3, amount: 25000, method: 'cash', description: 'Cicilan Juni 2025 - Budi Santoso', date: '2025-06-12', month: 'juni-2025' },
            { id: 5, type: 'installment', memberId: 4, amount: 30000, method: 'transfer', description: 'Cicilan Juni 2025 - Dewi Kusuma', date: '2025-06-12', month: 'juni-2025' }
        ],

        payments: [
            { memberId: 1, months: ['mei-2025', 'juni-2025'], status: 'paid' },
            { memberId: 2, months: ['mei-2025', 'juni-2025'], status: 'paid' },
            { memberId: 3, months: [], status: 'installment' },
            { memberId: 4, months: ['mei-2025'], status: 'installment' },
            { id: 5, months: [], status: 'unpaid' }
        ],

        installments: [
            { memberId: 3, month: 'juni-2025', paid: 25000, remaining: 25000 },
            { memberId: 4, month: 'juni-2025', paid: 30000, remaining: 20000 }
        ],

        init() {
            const userRole = localStorage.getItem('userRole');
            this.isViewOnly = userRole === 'pengawas' || window.location.search.includes('viewOnly=true');
            this.loadData();
            this.startMonthSlider();
            this.syncPaymentsWithTransactions(); // Sync payments on init
        },

        loadData() {
            const savedMembers = localStorage.getItem('members');
            if (savedMembers) this.members = JSON.parse(savedMembers);
            const savedTransactions = localStorage.getItem('transactions');
            if (savedTransactions) this.transactions = JSON.parse(savedTransactions);
            const savedPayments = localStorage.getItem('payments');
            if (savedPayments) this.payments = JSON.parse(savedPayments);
            const savedInstallments = localStorage.getItem('installments');
            if (savedInstallments) this.installments = JSON.parse(savedInstallments);
            const savedSettings = localStorage.getItem('settings');
            if (savedSettings) this.settings = JSON.parse(savedSettings);
        },

        saveData() {
            localStorage.setItem('members', JSON.stringify(this.members));
            localStorage.setItem('transactions', JSON.stringify(this.transactions));
            localStorage.setItem('payments', JSON.stringify(this.payments));
            localStorage.setItem('installments', JSON.stringify(this.installments));
            localStorage.setItem('settings', JSON.stringify(this.settings));
            this.syncPaymentsWithTransactions(); // Ensure payments are in sync after save
            this.updateMonthPercentages();
        },

        startMonthSlider() {
            const slider = this.$refs.monthSlider;
            if (!slider) return;

            let currentIndex = this.months.findIndex(m => m.id === this.settings.activeMonth);
            if (currentIndex === -1) currentIndex = 0;

            const scrollWidth = slider.children[0]?.offsetWidth || 280;
            setInterval(() => {
                currentIndex = (currentIndex + 1) % this.months.length;
                slider.scrollTo({
                    left: currentIndex * (scrollWidth + 16),
                    behavior: 'smooth'
                });
            }, 3000);
        },

        formatCurrency(amount) {
            return 'Rp ' + new Intl.NumberFormat('id-ID').format(amount);
        },

        getTotalOverall() {
            return this.getTotalIncome() - this.getTotalExpense();
        },

        getTotalIncome() {
            return this.transactions.filter(t => t.type === 'income' || t.type === 'installment').reduce((sum, t) => sum + t.amount, 0);
        },

        getTotalExpense() {
            return this.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        },

        getCashIncome() {
            return this.transactions.filter(t => (t.type === 'income' || t.type === 'installment') && t.method === 'cash').reduce((sum, t) => sum + t.amount, 0);
        },

        getTransferIncome() {
            return this.transactions.filter(t => (t.type === 'income' || t.type === 'installment') && t.method === 'transfer').reduce((sum, t) => sum + t.amount, 0);
        },

        getCashExpense() {
            return this.transactions.filter(t => t.type === 'expense' && t.method === 'cash').reduce((sum, t) => sum + t.amount, 0);
        },

        getTransferExpense() {
            return this.transactions.filter(t => t.type === 'expense' && t.method === 'transfer').reduce((sum, t) => sum + t.amount, 0);
        },

        filteredMembers() {
            return this.members.filter(member =>
                member.name.toLowerCase().includes(this.memberSearch.toLowerCase()) ||
                member.rayon.toLowerCase().includes(this.memberSearch.toLowerCase())
            );
        },

        addMember() {
            if (this.isViewOnly) {
                alert('Aksi ini tidak diizinkan untuk role Pengawas.');
                return;
            }
            if (!this.memberForm.name || !this.memberForm.phone || !this.memberForm.address || !this.memberForm.rayon) {
                alert('Semua field harus diisi.');
                return;
            }
            if (this.memberForm.id) {
                const index = this.members.findIndex(m => m.id === this.memberForm.id);
                if (index !== -1) {
                    this.members[index] = { ...this.memberForm };
                }
            } else {
                this.members.push({
                    id: this.members.length + 1,
                    ...this.memberForm
                });
            }
            this.saveData();
            this.memberForm = { id: null, name: '', phone: '', address: '', rayon: '' };
            this.showAddMember = false;
        },

        editMember(member) {
            if (this.isViewOnly) {
                alert('Aksi ini tidak diizinkan untuk role Pengawas.');
                return;
            }
            this.memberForm = { ...member };
            this.showAddMember = true;
        },

        addIncomeTransaction() {
            if (this.isViewOnly) {
                alert('Aksi ini tidak diizinkan untuk role Pengawas.');
                return;
            }
            let amount, description;
            if (this.incomeForm.type === 'member') {
                const member = this.members.find(m => m.id === Number(this.incomeForm.memberId));
                if (!member || !this.incomeForm.months.length) {
                    alert('Pilih anggota dan minimal satu bulan.');
                    return;
                }
                amount = this.incomeForm.months.length * this.settings.monthlyFee;
                description = this.incomeForm.description || `Iuran ${this.incomeForm.months.map(m => this.months.find(mt => mt.id === m)?.name).join(', ')} - ${member.name}`;
            } else {
                if (!this.incomeForm.amount || this.incomeForm.amount <= 0) {
                    alert('Masukkan jumlah yang valid.');
                    return;
                }
                amount = this.incomeForm.amount;
                description = this.incomeForm.description || `Kas Masuk Manual - ${new Date().toLocaleDateString('id-ID')}`;
            }

            const transaction = {
                id: this.transactions.length + 1,
                type: 'income',
                memberId: this.incomeForm.type === 'member' ? Number(this.incomeForm.memberId) : null,
                amount,
                method: this.incomeForm.method,
                description,
                date: new Date().toISOString().split('T')[0]
            };
            this.transactions.push(transaction);

            if (this.incomeForm.type === 'member') {
                const payment = this.payments.find(p => p.memberId === Number(this.incomeForm.memberId)) || { memberId: Number(this.incomeForm.memberId), months: [], status: 'paid' };
                payment.months = [...new Set([...payment.months, ...this.incomeForm.months])];
                if (!this.payments.find(p => p.memberId === payment.memberId)) this.payments.push(payment);
            }

            this.saveData();
            this.incomeForm = { type: 'member', memberId: '', amount: 0, method: 'cash', months: [], description: '' };
        },

        addInstallmentTransaction() {
            if (this.isViewOnly) {
                alert('Aksi ini tidak diizinkan untuk role Pengawas.');
                return;
            }
            const member = this.members.find(m => m.id === Number(this.installmentForm.memberId));
            if (!member || !this.installmentForm.month || this.installmentForm.amount <= 0 || this.installmentForm.amount > this.settings.monthlyFee) {
                alert('Lengkapi form dengan data yang valid.');
                return;
            }

            const transaction = {
                id: this.transactions.length + 1,
                type: 'installment',
                memberId: Number(this.installmentForm.memberId),
                amount: Number(this.installmentForm.amount),
                method: this.installmentForm.method,
                description: this.installmentForm.description || `Cicilan ${this.months.find(m => m.id === this.installmentForm.month)?.name} - ${member.name}`,
                date: new Date().toISOString().split('T')[0],
                month: this.installmentForm.month
            };
            this.transactions.push(transaction);

            let installment = this.installments.find(i => i.memberId === Number(this.installmentForm.memberId) && i.month === this.installmentForm.month);
            if (installment) {
                installment.paid += Number(this.installmentForm.amount);
                installment.remaining = this.settings.monthlyFee - installment.paid;
            } else {
                this.installments.push({
                    memberId: Number(this.installmentForm.memberId),
                    month: this.installmentForm.month,
                    paid: Number(this.installmentForm.amount),
                    remaining: this.settings.monthlyFee - Number(this.installmentForm.amount)
                });
            }

            let payment = this.payments.find(p => p.memberId === Number(this.installmentForm.memberId));
            if (payment) {
                payment.status = 'installment';
            } else {
                this.payments.push({ memberId: Number(this.installmentForm.memberId), months: [], status: 'installment' });
            }

            this.saveData();
            this.installmentForm = { memberId: '', month: '', amount: 0, method: 'cash', description: '' };
        },

        addExpenseTransaction() {
            if (this.isViewOnly) {
                alert('Aksi ini tidak diizinkan untuk role Pengawas.');
                return;
            }
            if (!this.expenseForm.name || !this.expenseForm.category || this.expenseForm.amount <= 0) {
                alert('Lengkapi form dengan data yang valid.');
                return;
            }

            this.transactions.push({
                id: this.transactions.length + 1,
                type: 'expense',
                amount: Number(this.expenseForm.amount),
                category: this.expenseForm.category,
                description: this.expenseForm.description || this.expenseForm.name,
                date: new Date().toISOString().split('T')[0]
            });

            this.saveData();
            this.expenseForm = { name: '', category: '', amount: 0, description: '' };
        },

        updateMonthPercentages() {
            this.months.forEach(month => {
                const totalMembers = this.members.length;
                const paidCount = this.payments.filter(p => p.months.includes(month.id)).length;
                const installmentCount = this.installments.filter(i => i.month === month.id && i.paid < this.settings.monthlyFee).length;

                month.paidPercentage = Math.round((paidCount / totalMembers) * 100);
                month.installmentPercentage = Math.round((installmentCount / totalMembers) * 100);
            });
        },

        syncPaymentsWithTransactions() {
            this.members.forEach(member => {
                const memberTransactions = this.transactions.filter(t => t.memberId === member.id);
                let payment = this.payments.find(p => p.memberId === member.id) || { memberId: member.id, months: [], status: 'unpaid' };

                if (!this.payments.find(p => p.memberId === member.id)) this.payments.push(payment);

                const paidMonths = memberTransactions.filter(t => t.type === 'income').flatMap(t => t.months || []);
                const installmentMonths = memberTransactions.filter(t => t.type === 'installment').map(t => t.month);

                payment.months = [...new Set([...payment.months, ...paidMonths])];
                payment.status = installmentMonths.length > 0 ? 'installment' : paidMonths.length > 0 ? 'paid' : 'unpaid';

                const installment = this.installments.find(i => i.memberId === member.id && i.month === this.settings.activeMonth);
                if (installment && installment.paid >= this.settings.monthlyFee) {
                    payment.status = 'paid';
                    payment.months.push(this.settings.activeMonth);
                }
            });
        },

        getUnpaidMembers() {
            return this.members.filter(m => {
                const payment = this.payments.find(p => p.memberId === m.id);
                return !payment || (!payment.months.includes(this.settings.activeMonth) && payment.status !== 'installment');
            });
        },

        getPaidMembers() {
            return this.members.filter(m => {
                const payment = this.payments.find(p => p.memberId === m.id);
                return payment && payment.months.includes(this.settings.activeMonth);
            });
        },

        getInstallmentMembers() {
            return this.members.filter(m => {
                const payment = this.payments.find(p => p.memberId === m.id);
                return payment && payment.status === 'installment';
            });
        },

        getMemberInstallmentPaid(memberId) {
            return this.installments
                .filter(i => i.memberId === memberId && i.month === this.settings.activeMonth)
                .reduce((sum, i) => sum + i.paid, 0);
        },

        getMemberInstallmentRemaining(memberId) {
            return this.installments
                .filter(i => i.memberId === memberId && i.month === this.settings.activeMonth)
                .reduce((sum, i) => sum + i.remaining, 0);
        },

        getMonthUnpaidMembers(month) {
            return this.members.filter(m => {
                const payment = this.payments.find(p => p.memberId === m.id);
                return !payment || !payment.months.includes(month.id);
            });
        },

        getMonthInstallmentMembers(month) {
            return this.members.filter(m => {
                const installment = this.installments.find(i => i.memberId === m.id && i.month === month.id);
                return installment && installment.paid < this.settings.monthlyFee;
            });
        },

        getMonthPaidMembers(month) {
            return this.members.filter(m => {
                const payment = this.payments.find(p => p.memberId === m.id);
                return payment && payment.months.includes(month.id);
            });
        },

        getMemberMonthInstallmentPaid(memberId, monthId) {
            const installment = this.installments.find(i => i.memberId === memberId && i.month === monthId);
            return installment ? installment.paid : 0;
        },

        getFilteredReports() {
            let reports = [];
            this.members.forEach(member => {
                this.months.forEach(month => {
                    const payment = this.payments.find(p => p.memberId === member.id);
                    const installment = this.installments.find(i => i.memberId === member.id && i.month === month.id);
                    const transaction = this.transactions.find(t => t.memberId === member.id && (t.month === month.id || t.type === 'income'));

                    let status = 'unpaid';
                    let amount = 0;
                    let method = '-';
                    let installmentPaid = 0;

                    if (payment && payment.months.includes(month.id)) {
                        status = 'paid';
                        amount = this.settings.monthlyFee;
                        method = transaction?.method || '-';
                    } else if (installment) {
                        status = 'installment';
                        amount = installment.paid;
                        method = transaction?.method || '-';
                        installmentPaid = installment.paid;
                    }

                    reports.push({
                        id: `${member.id}-${month.id}`,
                        memberName: member.name,
                        month: month.name,
                        status,
                        amount,
                        method,
                        installmentPaid
                    });
                });
            });

            return reports.filter(report => {
                const matchesSearch = !this.reportSearch || report.memberName.toLowerCase().includes(this.reportSearch.toLowerCase());
                const matchesMonth = !this.reportFilter.month || report.id.includes(this.reportFilter.month);
                const matchesYear = !this.reportFilter.year || report.month.includes(this.reportFilter.year);
                const matchesStatus = !this.reportFilter.status || report.status === this.reportFilter.status;
                return matchesSearch && matchesMonth && matchesYear && matchesStatus;
            });
        },

        saveSettings() {
            if (this.isViewOnly) {
                alert('Aksi ini tidak diizinkan untuk role Pengawas.');
                return;
            }
            this.saveData();
        },

        logout() {
            localStorage.removeItem('userRole');
            window.location.href = 'login.html';
        }
    };
}