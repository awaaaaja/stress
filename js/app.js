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
            division: ''
        },

        incomeForm: {
            memberId: '',
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
            { id: 1, name: 'Ahmad Rizki', phone: '081234567890', address: 'Jl. Merdeka No. 10', division: 'Marketing' },
            { id: 2, name: 'Siti Nurhaliza', phone: '081234567891', address: 'Jl. Sudirman No. 15', division: 'Finance' },
            { id: 3, name: 'Budi Santoso', phone: '081234567892', address: 'Jl. Gatot Subroto No. 20', division: 'Operations' },
            { id: 4, name: 'Dewi Kusuma', phone: '081234567893', address: 'Jl. Ahmad Yani No. 25', division: 'HR' },
            { id: 5, name: 'Eko Prasetyo', phone: '081234567894', address: 'Jl. Diponegoro No. 30', division: 'IT' }
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
            { id: 1, type: 'income', memberId: 1, amount: 50000, method: 'cash', description: 'Iuran Juni 2025 - Ahmad Rizki', date: '2025-06-01' },
            { id: 2, type: 'income', memberId: 2, amount: 100000, method: 'transfer', description: 'Iuran Mei-Juni 2025 - Siti Nurhaliza', date: '2025-06-02' },
            { id: 3, type: 'expense', amount: 75000, category: 'konsumsi', description: 'Konsumsi rapat bulanan', date: '2025-06-03' },
            { id: 4, type: 'installment', memberId: 3, amount: 25000, method: 'cash', description: 'Cicilan Juni 2025 - Budi Santoso', date: '2025-06-04', month: 'juni-2025' },
            { id: 5, type: 'installment', memberId: 4, amount: 30000, method: 'transfer', description: 'Cicilan Juni 2025 - Dewi Kusuma', date: '2025-06-05', month: 'juni-2025' }
        ],

        payments: [
            { memberId: 1, months: ['mei-2025', 'juni-2025'], status: 'paid' },
            { memberId: 2, months: ['mei-2025', 'juni-2025'], status: 'paid' },
            { memberId: 3, months: [], status: 'installment' },
            { memberId: 4, months: ['mei-2025'], status: 'installment' },
            { memberId: 5, months: [], status: 'unpaid' }
        ],

        installments: [
            { memberId: 3, month: 'juni-2025', paid: 25000, remaining: 25000 },
            { memberId: 4, month: 'juni-2025', paid: 30000, remaining: 20000 }
        ],

        init() {
            this.loadData();
            this.startMonthSlider();
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
        },

        startMonthSlider() {
            const slider = this.$refs.monthSlider;
            if (!slider) return;

            let currentIndex = 0;
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

        getTotalBalance() {
            return this.getTotalIncome() + this.getInstallmentTotal() - this.getTotalExpense();
        },

        getTotalIncome() {
            return this.transactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);
        },

        getTotalExpense() {
            return this.transactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);
        },

        getInstallmentTotal() {
            return this.transactions
                .filter(t => t.type === 'installment')
                .reduce((sum, t) => sum + t.amount, 0);
        },

        getCashTotal() {
            return this.transactions
                .filter(t => (t.type === 'income' || t.type === 'installment') && t.method === 'cash')
                .reduce((sum, t) => sum + t.amount, 0);
        },

        getTransferTotal() {
            return this.transactions
                .filter(t => (t.type === 'income' || t.type === 'installment') && t.method === 'transfer')
                .reduce((sum, t) => sum + t.amount, 0);
        },

        filteredMembers() {
            return this.members.filter(member =>
                member.name.toLowerCase().includes(this.memberSearch.toLowerCase()) ||
                member.division.toLowerCase().includes(this.memberSearch.toLowerCase())
            );
        },

        addMember() {
            if (this.memberForm.id) {
                const index = this.members.findIndex(m => m.id === this.memberForm.id);
                if (index !== -1) {
                    this.members[index] = { ...this.memberForm };
                }
            } else {
                this.members.push({
                    id: this.members.length + 1,
                    name: this.memberForm.name,
                    phone: this.memberForm.phone,
                    address: this.memberForm.address,
                    division: this.memberForm.division
                });
            }
            this.saveData();
            this.memberForm = { id: null, name: '', phone: '', address: '', division: '' };
            this.showAddMember = false;
        },

        editMember(member) {
            this.memberForm = { ...member };
            this.showAddMember = true;
        },

        addIncomeTransaction() {
            const member = this.members.find(m => m.id === Number(this.incomeForm.memberId));
            if (!member || !this.incomeForm.months.length) {
                alert('Pilih anggota dan minimal satu bulan.');
                return;
            }

            const amount = this.incomeForm.months.length * this.settings.monthlyFee;
            this.transactions.push({
                id: this.transactions.length + 1,
                type: 'income',
                memberId: Number(this.incomeForm.memberId),
                amount,
                method: this.incomeForm.method,
                description: this.incomeForm.description || `Iuran ${this.incomeForm.months.map(i => this.months.find(m => m.id === i)?.name).join(', ')} - ${member.name}`,
                date: new Date().toISOString().split('T')[0]
            });

            const payment = this.payments.find(p => p.memberId === Number(this.incomeForm.memberId));
            if (payment) {
                payment.months = [...new Set([...payment.months, ...this.incomeForm.months])];
                payment.status = 'paid';
            } else {
                this.payments.push({
                    memberId: Number(this.incomeForm.memberId),
                    months: this.incomeForm.months,
                    status: 'paid'
                });
            }

            this.updateMonthPercentages();
            this.saveData();
            this.incomeForm = { memberId: '', method: 'cash', months: [], description: '' };
        },

        addInstallmentTransaction() {
            const member = this.members.find(m => m.id === Number(this.installmentForm.memberId));
            if (!member || !this.installmentForm.month || this.installmentForm.amount <= 0 || this.installmentForm.amount > this.settings.monthlyFee) {
                alert('Lengkapi form dengan data yang valid.');
                return;
            }

            this.transactions.push({
                id: this.transactions.length + 1,
                type: 'installment',
                memberId: Number(this.installmentForm.memberId),
                amount: Number(this.installmentForm.amount),
                method: this.installmentForm.method,
                description: this.installmentForm.description || `Cicilan ${this.months.find(m => m.id === this.installmentForm.month)?.name} - ${member.name}`,
                date: new Date().toISOString().split('T')[0],
                month: this.installmentForm.month
            });

            const installment = this.installments.find(i => i.memberId === Number(this.installmentForm.memberId) && i.month === this.installmentForm.month);
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

            const payment = this.payments.find(p => p.memberId === Number(this.installmentForm.memberId));
            if (payment) {
                payment.status = 'installment';
            } else {
                this.payments.push({
                    memberId: Number(this.installmentForm.memberId),
                    months: [],
                    status: 'installment'
                });
            }

            this.updateMonthPercentages();
            this.saveData();
            this.installmentForm = { memberId: '', month: '', amount: 0, method: 'cash', description: '' };
        },

        addExpenseTransaction() {
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

        getUnpaidMembers() {
            return this.members.filter(m => {
                const payment = this.payments.find(p => p.memberId === m.id);
                return !payment || (!payment.months.includes(this.settings.activeMonth) && payment.status !== 'installment');
            });
        },

        getInstallment() {
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
                    let method = '';
                    let installmentPaid = 0;

                    if (payment && payment.months.includes(month.id)) {
                        status = 'paid';
                        amount = this.settings.monthlyFee;
                        method = transaction?.method || '';
                    } else if (installment) {
                        status = 'installment';
                        amount = installment.paid;
                        method = transaction?.method || '';
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

            // Apply search
            if (this.reportSearch) {
                reports = reports.filter(report =>
                    report.memberName.toLowerCase().includes(this.reportSearch.toLowerCase())
                );
            }

            // Apply filters
            if (this.reportFilter.month) {
                reports = reports.filter(report =>
                    report.id.includes(this.reportFilter.month)
                );
            }
            if (this.reportFilter.year) {
                reports = reports.filter(report =>
                    report.month.includes(this.reportFilter.year)
                );
            }
            if (this.reportFilter.status) {
                reports = reports.filter(report =>
                    report.status === this.reportFilter.status
                );
            }

            return reports;
        },

        saveSettings() {
            this.saveData();
        },

        logout() {
            alert('Logged out');
            this.activeTab = 'dashboard';
        }
    };
}