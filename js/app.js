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
        showDetailModal: false,
        detailType: '',

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
            method: 'cash',
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
            { id: 3, type: 'expense', amount: 75000, category: 'konsumsi', method: 'cash', description: 'Konsumsi rapat bulanan', date: '2025-06-12' },
            { id: 4, type: 'installment', memberId: 3, amount: 25000, method: 'cash', description: 'Cicilan Juni 2025 - Budi Santoso', date: '2025-06-12', month: 'juni-2025' },
            { id: 5, type: 'installment', memberId: 4, amount: 30000, method: 'transfer', description: 'Cicilan Juni 2025 - Dewi Kusuma', date: '2025-06-12', month: 'juni-2025' }
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
            const userRole = localStorage.getItem('userRole');
            this.isViewOnly = userRole === 'pengawas' || window.location.search.includes('viewOnly=true');
            this.loadData();
            this.startMonthSlider();
            this.syncPaymentsWithTransactions();
        },

        loadData() {
            const savedData = localStorage.getItem('kasaProData');
            if (savedData) {
                const data = JSON.parse(savedData);
                this.settings = { ...this.settings, ...data.settings };
                this.members = data.members || this.members;
                this.transactions = data.transactions || this.transactions;
                this.payments = data.payments || this.payments;
                this.installments = data.installments || this.installments;
            }
        },

        saveData() {
            const data = {
                settings: this.settings,
                members: this.members,
                transactions: this.transactions,
                payments: this.payments,
                installments: this.installments
            };
            localStorage.setItem('kasaProData', JSON.stringify(data));
            this.syncPaymentsWithTransactions();
        },

        saveSettings() {
            this.saveData();
            alert('Pengaturan berhasil disimpan!');
        },

        logout() {
            localStorage.removeItem('userRole');
            window.location.href = '/login';
        },

        formatCurrency(amount) {
            return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
        },

        startMonthSlider() {
            const slider = this.$refs.monthSlider;
            let isDown = false;
            let startX;
            let scrollLeft;

            slider.addEventListener('mousedown', (e) => {
                isDown = true;
                startX = e.pageX - slider.offsetLeft;
                scrollLeft = slider.scrollLeft;
            });

            slider.addEventListener('mouseleave', () => {
                isDown = false;
            });

            slider.addEventListener('mouseup', () => {
                isDown = false;
            });

            slider.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - slider.offsetLeft;
                const walk = (x - startX) * 1.5; // Speed of scroll
                slider.scrollLeft = scrollLeft - walk;
            });
        },

        syncPaymentsWithTransactions() {
            this.transactions.forEach(transaction => {
                if (transaction.type === 'income' && transaction.memberId) {
                    const payment = this.payments.find(p => p.memberId === transaction.memberId) || { memberId: transaction.memberId, months: [], status: 'paid' };
                    transaction.months = transaction.months || [];
                    payment.months = [...new Set([...payment.months, ...transaction.months])];
                    if (!this.payments.find(p => p.memberId === payment.memberId)) this.payments.push(payment);
                }
            });
            this.updateMonthPercentages();
        },

        updateMonthPercentages() {
            this.months.forEach(month => {
                const paidMembers = this.getMonthPaidMembers(month).length;
                const totalMembers = this.members.length;
                month.paidPercentage = totalMembers ? Math.round((paidMembers / totalMembers) * 100) : 0;
                const installmentMembers = this.getMonthInstallmentMembers(month).length;
                month.installmentPercentage = totalMembers ? Math.round((installmentMembers / totalMembers) * 100) : 0;
            });
        },

        addMember() {
            if (!this.memberForm.name || !this.memberForm.phone || !this.memberForm.rayon) {
                alert('Lengkapi semua field wajib.');
                return;
            }
            if (this.memberForm.id) {
                const index = this.members.findIndex(m => m.id === this.memberForm.id);
                this.members[index] = { ...this.memberForm, id: this.memberForm.id };
            } else {
                this.memberForm.id = this.members.length ? Math.max(...this.members.map(m => m.id)) + 1 : 1;
                this.members.push({ ...this.memberForm });
            }
            this.saveData();
            this.showAddMember = false;
            this.memberForm = { id: null, name: '', phone: '', address: '', rayon: '' };
        },

        editMember(member) {
            this.memberForm = { ...member };
            this.showAddMember = true;
        },

        filteredMembers() {
            return this.members.filter(member =>
                member.name.toLowerCase().includes(this.memberSearch.toLowerCase()) ||
                member.rayon.toLowerCase().includes(this.memberSearch.toLowerCase())
            );
        },

        getPaidMembers() {
            const activeMonth = this.settings.activeMonth;
            return this.members.filter(member => {
                const payment = this.payments.find(p => p.memberId === member.id);
                return payment && payment.months.includes(activeMonth) && payment.status === 'paid';
            });
        },

        getUnpaidMembers() {
            const activeMonth = this.settings.activeMonth;
            return this.members.filter(member => {
                const payment = this.payments.find(p => p.memberId === member.id);
                return !payment || !payment.months.includes(activeMonth) || payment.status === 'unpaid';
            });
        },

        getMonthPaidMembers(month) {
            return this.members.filter(member => {
                const payment = this.payments.find(p => p.memberId === member.id);
                return payment && payment.months.includes(month.id) && payment.status === 'paid';
            });
        },

        getMonthUnpaidMembers(month) {
            return this.members.filter(member => {
                const payment = this.payments.find(p => p.memberId === member.id);
                return !payment || !payment.months.includes(month.id) || payment.status === 'unpaid';
            });
        },

        getMonthInstallmentMembers(month) {
            return this.members.filter(member => {
                const payment = this.payments.find(p => p.memberId === member.id);
                return payment && payment.status === 'installment' && payment.months.includes(month.id);
            });
        },

        getMemberInstallmentPaid(memberId) {
            const installment = this.installments.find(i => i.memberId === memberId);
            return installment ? installment.paid : 0;
        },

        getMemberMonthInstallmentPaid(memberId, monthId) {
            const installment = this.installments.find(i => i.memberId === memberId && i.month === monthId);
            return installment ? installment.paid : 0;
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
            } else if (this.incomeForm.type === 'manual') {
                if (!this.incomeForm.amount || this.incomeForm.amount <= 0) {
                    alert('Masukkan jumlah yang valid.');
                    return;
                }
                amount = Number(this.incomeForm.amount);
                description = this.incomeForm.description || `Kas Masuk Manual - ${new Date().toLocaleDateString('id-ID')}`;
            } else {
                alert('Pilih tipe transaksi yang valid.');
                return;
            }

            const transaction = {
                id: this.transactions.length ? Math.max(...this.transactions.map(t => t.id)) + 1 : 1,
                type: 'income',
                memberId: this.incomeForm.type === 'member' ? Number(this.incomeForm.memberId) : null,
                amount: amount,
                method: this.incomeForm.method,
                description: description,
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
            if (!this.installmentForm.memberId || !this.installmentForm.month || this.installmentForm.amount <= 0 || this.installmentForm.amount > this.settings.monthlyFee) {
                alert('Lengkapi semua field dan pastikan nominal tidak melebihi iuran bulanan.');
                return;
            }

            const member = this.members.find(m => m.id === Number(this.installmentForm.memberId));
            const transaction = {
                id: this.transactions.length ? Math.max(...this.transactions.map(t => t.id)) + 1 : 1,
                type: 'installment',
                memberId: Number(this.installmentForm.memberId),
                amount: Number(this.installmentForm.amount),
                method: this.installmentForm.method,
                description: this.installmentForm.description || `Cicilan ${this.months.find(m => m.id === this.installmentForm.month)?.name} - ${member.name}`,
                date: new Date().toISOString().split('T')[0],
                month: this.installmentForm.month
            };
            this.transactions.push(transaction);

            let installment = this.installments.find(i => i.memberId === transaction.memberId && i.month === transaction.month);
            if (installment) {
                installment.paid += transaction.amount;
                installment.remaining = Math.max(0, this.settings.monthlyFee - installment.paid);
            } else {
                this.installments.push({
                    memberId: transaction.memberId,
                    month: transaction.month,
                    paid: transaction.amount,
                    remaining: this.settings.monthlyFee - transaction.amount
                });
            }

            const payment = this.payments.find(p => p.memberId === transaction.memberId) || { memberId: transaction.memberId, months: [], status: 'installment' };
            if (!payment.months.includes(transaction.month)) payment.months.push(transaction.month);
            if (!this.payments.find(p => p.memberId === payment.memberId)) this.payments.push(payment);

            this.saveData();
            this.installmentForm = { memberId: '', month: '', amount: 0, method: 'cash', description: '' };
        },

        addExpenseTransaction() {
            if (this.isViewOnly) {
                alert('Aksi ini tidak diizinkan untuk role Pengawas.');
                return;
            }
            if (!this.expenseForm.name || !this.expenseForm.category || this.expenseForm.amount <= 0 || !this.expenseForm.method) {
                alert('Lengkapi semua field, termasuk metode pembayaran.');
                return;
            }

            const transaction = {
                id: this.transactions.length ? Math.max(...this.transactions.map(t => t.id)) + 1 : 1,
                type: 'expense',
                amount: Number(this.expenseForm.amount),
                category: this.expenseForm.category,
                method: this.expenseForm.method,
                description: this.expenseForm.description || this.expenseForm.name,
                date: new Date().toISOString().split('T')[0]
            };
            this.transactions.push(transaction);

            this.saveData();
            this.expenseForm = { name: '', category: '', amount: 0, method: 'cash', description: '' };
        },

        getTotalIncome() {
            return this.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) || 0;
        },

        getTotalExpense() {
            return this.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0) || 0;
        },

        getTotalOverall() {
            return this.getTotalIncome() - this.getTotalExpense() || 0;
        },

        getCashIncome() {
            return this.transactions.filter(t => t.type === 'income' && t.method === 'cash').reduce((sum, t) => sum + t.amount, 0) || 0;
        },

        getTransferIncome() {
            return this.transactions.filter(t => t.type === 'income' && t.method === 'transfer').reduce((sum, t) => sum + t.amount, 0) || 0;
        },

        getCashExpense() {
            return this.transactions.filter(t => t.type === 'expense' && t.method === 'cash').reduce((sum, t) => sum + t.amount, 0) || 0;
        },

        getTransferExpense() {
            return this.transactions.filter(t => t.type === 'expense' && t.method === 'transfer').reduce((sum, t) => sum + t.amount, 0) || 0;
        },

        getTotalCash() {
            return (this.getCashIncome() - this.getCashExpense()) || 0;
        },

        getTotalTransfer() {
            return (this.getTransferIncome() - this.getTransferExpense()) || 0;
        },

        getFilteredReports() {
            return this.members.map(member => {
                const payment = this.payments.find(p => p.memberId === member.id) || { months: [], status: 'unpaid' };
                const installment = this.installments.find(i => i.memberId === member.id);
                const transactions = this.transactions.filter(t => t.memberId === member.id && (t.type === 'income' || t.type === 'installment'));

                return this.months.map(month => {
                    const paid = payment.months.includes(month.id) && payment.status === 'paid';
                    const installmentPaid = installment && installment.month === month.id ? installment.paid : 0;
                    const amount = transactions.find(t => t.months?.includes(month.id) || t.month === month.id)?.amount || (paid ? this.settings.monthlyFee : installmentPaid);
                    const method = transactions.find(t => t.months?.includes(month.id) || t.month === month.id)?.method;

                    if (amount > 0 || paid) {
                        return {
                            id: `${member.id}-${month.id}`,
                            memberId: member.id,
                            memberName: member.name,
                            month: month.name,
                            status: paid ? 'paid' : installmentPaid > 0 ? 'installment' : 'unpaid',
                            amount: amount,
                            installmentPaid: installmentPaid,
                            method: method
                        };
                    }
                }).filter(report => report);
            }).flat().filter(report => {
                const matchesSearch = !this.reportSearch || report.memberName.toLowerCase().includes(this.reportSearch.toLowerCase());
                const matchesMonth = !this.reportFilter.month || report.month.includes(this.reportFilter.month.split('-')[0]);
                const matchesYear = !this.reportFilter.year || report.month.includes(this.reportFilter.year);
                const matchesStatus = !this.reportFilter.status || report.status === this.reportFilter.status;
                return matchesSearch && matchesMonth && matchesYear && matchesStatus;
            });
        },

        showDetailModal(type) {
            this.detailType = type;
            this.showDetailModal = true;
        }
    };
}z