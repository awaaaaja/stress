function kasaProApp() {
    return {
        // State
        activeTab: 'dashboard',
        paymentType: 'income',
        isViewOnly: false,
        showAddMember: false,
        showMonthDetail: false,
        showDetailModal: false,
        selectedMonth: null,
        monthDetailTab: 'unpaid',
        detailType: '',
        memberSearch: '',
        reportSearch: '',
        reportFilter: { month: '', year: '', status: '' },
        settings: {
            organizationName: 'KasaPro',
            activeMonth: '6',
            monthlyFee: 100000
        },
        memberForm: { id: null, name: '', phone: '', address: '', rayon: '' },
        incomeForm: { type: 'member', memberId: '', year: '', months: [], amount: 0, method: 'cash', description: '' },
        installmentForm: { memberId: '', month: '', amount: 0, method: 'cash', description: '' },
        expenseForm: { name: '', category: '', amount: 0, method: 'cash', description: '' },
        members: [],
        months: [
            { id: '1', name: 'Januari', paidPercentage: 0, installmentPercentage: 0 },
            { id: '2', name: 'Februari', paidPercentage: 0, installmentPercentage: 0 },
            { id: '3', name: 'Maret', paidPercentage: 0, installmentPercentage: 0 },
            { id: '4', name: 'April', paidPercentage: 0, installmentPercentage: 0 },
            { id: '5', name: 'Mei', paidPercentage: 0, installmentPercentage: 0 },
            { id: '6', name: 'Juni', paidPercentage: 0, installmentPercentage: 0 },
            { id: '7', name: 'Juli', paidPercentage: 0, installmentPercentage: 0 },
            { id: '8', name: 'Agustus', paidPercentage: 0, installmentPercentage: 0 },
            { id: '9', name: 'September', paidPercentage: 0, installmentPercentage: 0 },
            { id: '10', name: 'Oktober', paidPercentage: 0, installmentPercentage: 0 },
            { id: '11', name: 'November', paidPercentage: 0, installmentPercentage: 0 },
            { id: '12', name: 'Desember', paidPercentage: 0, installmentPercentage: 0 }
        ],
        transactions: [],

        // Methods
        formatCurrency(amount) {
            return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
        },

        async fetchData() {
            try {
                const [membersRes, transactionsRes, settingsRes] = await Promise.all([
                    fetch('http://localhost:3000/api/members', {
                        headers: { Authorization: `Bearer ${localStorage.getItem('userRole')}` }
                    }),
                    fetch('http://localhost:3000/api/transactions', {
                        headers: { Authorization: `Bearer ${localStorage.getItem('userRole')}` }
                    }),
                    fetch('http://localhost:3000/api/settings', {
                        headers: { Authorization: `Bearer ${localStorage.getItem('userRole')}` }
                    })
                ]);
                this.members = await membersRes.json();
                this.transactions = await transactionsRes.json();
                this.settings = await settingsRes.json();
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },

        getTotalOverall() {
            const income = this.transactions
                .filter(t => t.type === 'income' || t.type === 'installment')
                .reduce((sum, t) => sum + t.amount, 0);
            const expense = this.transactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);
            return income - expense;
        },

        getTotalCash() {
            return this.transactions
                .filter(t => t.method === 'cash')
                .reduce((sum, t) => sum + (t.type === 'expense' ? -t.amount : t.amount), 0);
        },

        getTotalTransfer() {
            return this.transactions
                .filter(t => t.method === 'transfer')
                .reduce((sum, t) => sum + (t.type === 'expense' ? -t.amount : t.amount), 0);
        },

        getTotalIncome() {
            return this.transactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);
        },

        getCashIncome() {
            return this.transactions
                .filter(t => t.type === 'income' && t.method === 'cash')
                .reduce((sum, t) => sum + t.amount, 0);
        },

        getTransferIncome() {
            return this.transactions
                .filter(t => t.type === 'income' && t.method === 'transfer')
                .reduce((sum, t) => sum + t.amount, 0);
        },

        getTotalExpense() {
            return this.transactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);
        },

        getCashExpense() {
            return this.transactions
                .filter(t => t.type === 'expense' && t.method === 'cash')
                .reduce((sum, t) => sum + t.amount, 0);
        },

        getTransferExpense() {
            return this.transactions
                .filter(t => t.type === 'expense' && t.method === 'transfer')
                .reduce((sum, t) => sum + t.amount, 0);
        },

        getUnpaidMembers() {
            return this.members.filter(member => {
                const paid = this.transactions.some(t => 
                    (t.type === 'income' || t.type === 'installment') && 
                    t.memberId === member.id && 
                    t.month === this.settings.activeMonth &&
                    t.year === '2025'
                );
                return !paid;
            });
        },

        getPaidMembers() {
            return this.members.filter(member => {
                return this.transactions.some(t => 
                    t.type === 'income' && 
                    t.memberId === member.id && 
                    t.month === this.settings.activeMonth &&
                    t.year === '2025'
                );
            });
        },

        getMonthDetailUnpaidMembers(month) {
            if (!month || !month.id) return [];
            return this.members.filter(member => {
                const paid = this.transactions.some(t => 
                    (t.type === 'income' || t.type === 'installment') && 
                    t.memberId === member.id && 
                    t.month === month.id &&
                    t.year === '2025'
                );
                return !paid;
            });
        },

        getMonthDetailPaidMembers(month) {
            if (!month || !month.id) return [];
            return this.members.filter(member => {
                return this.transactions.some(t => 
                    t.type === 'income' && 
                    t.memberId === member.id && 
                    t.month === month.id &&
                    t.year === '2025'
                );
            });
        },

        filteredMembers() {
            return this.members.filter(member => 
                member.name.toLowerCase().includes(this.memberSearch.toLowerCase())
            );
        },

        getMemberInstallmentPaid(memberId) {
            return this.transactions
                .filter(t => t.type === 'installment' && t.memberId === memberId)
                .reduce((sum, t) => sum + t.amount, 0);
        },

        async addMember() {
            if (this.isViewOnly) return;
            try {
                const method = this.memberForm.id ? 'PUT' : 'POST';
                const url = this.memberForm.id ? `http://localhost:3000/api/members/${this.memberForm.id}` : 'http://localhost:3000/api/members';
                const response = await fetch(url, {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('userRole')}`
                    },
                    body: JSON.stringify(this.memberForm)
                });
                if (response.ok) {
                    const member = await response.json();
                    if (this.memberForm.id) {
                        const index = this.members.findIndex(m => m.id === this.memberForm.id);
                        if (index !== -1) this.members[index] = member;
                    } else {
                        this.members.push(member);
                    }
                    this.showAddMember = false;
                    this.memberForm = { id: null, name: '', phone: '', address: '', rayon: '' };
                } else {
                    alert('Error saving member');
                }
            } catch (error) {
                console.error('Error saving member:', error);
            }
        },

        editMember(member) {
            if (this.isViewOnly) return;
            this.memberForm = { ...member };
            this.showAddMember = true;
        },

        async addIncomeTransaction() {
            if (this.isViewOnly) return;
            try {
                const response = await fetch('http://localhost:3000/api/transactions/income', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('userRole')}`
                    },
                    body: JSON.stringify({
                        ...this.incomeForm,
                        description: this.incomeForm.type === 'member' 
                            ? `Iuran ${this.members.find(m => m.id === this.incomeForm.memberId).name} - ${this.incomeForm.months.map(id => this.months.find(m => m.id === id).name).join(', ')} ${this.incomeForm.year}`
                            : this.incomeForm.description || 'Transaksi Manual',
                        amount: this.incomeForm.type === 'member' ? this.settings.monthlyFee : this.incomeForm.amount
                    })
                });
                if (response.ok) {
                    await this.fetchData();
                    this.incomeForm = { type: 'member', memberId: '', year: '', months: [], amount: 0, method: 'cash', description: '' };
                } else {
                    alert('Error saving income transaction');
                }
            } catch (error) {
                console.error('Error saving income transaction:', error);
            }
        },

        async addInstallmentTransaction() {
            if (this.isViewOnly) return;
            try {
                const response = await fetch('http://localhost:3000/api/transactions/installment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('userRole')}`
                    },
                    body: JSON.stringify({
                        ...this.installmentForm,
                        description: `Cicilan ${this.members.find(m => m.id === this.installmentForm.memberId).name} - ${this.months.find(m => m.id === this.installmentForm.month).name}`
                    })
                });
                if (response.ok) {
                    await this.fetchData();
                    this.installmentForm = { memberId: '', month: '', amount: 0, method: 'cash', description: '' };
                } else {
                    alert('Error saving installment transaction');
                }
            } catch (error) {
                console.error('Error saving installment transaction:', error);
            }
        },

        async addExpenseTransaction() {
            if (this.isViewOnly) return;
            try {
                const response = await fetch('http://localhost:3000/api/transactions/expense', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('userRole')}`
                    },
                    body: JSON.stringify(this.expenseForm)
                });
                if (response.ok) {
                    await this.fetchData();
                    this.expenseForm = { name: '', category: '', amount: 0, method: 'cash', description: '' };
                } else {
                    alert('Error saving expense transaction');
                }
            } catch (error) {
                console.error('Error saving expense transaction:', error);
            }
        },

        async getFilteredReports() {
            try {
                const query = new URLSearchParams(this.reportFilter).toString();
                const response = await fetch(`http://localhost:3000/api/reports?${query}&search=${this.reportSearch}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('userRole')}` }
                });
                return await response.json();
            } catch (error) {
                console.error('Error fetching reports:', error);
                return [];
            }
        },

        async exportToCSV() {
            try {
                const query = new URLSearchParams(this.reportFilter).toString();
                const response = await fetch(`http://localhost:3000/api/reports/export?${query}&search=${this.reportSearch}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('userRole')}` }
                });
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'laporan_pembayaran.csv';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (error) {
                console.error('Error exporting CSV:', error);
            }
        },

        showDetailModal(type) {
            this.detailType = type;
            this.showDetailModal = true;
        },

        async saveSettings() {
            if (this.isViewOnly) return;
            try {
                const response = await fetch('http://localhost:3000/api/settings', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('userRole')}`
                    },
                    body: JSON.stringify(this.settings)
                });
                if (response.ok) {
                    alert('Pengaturan telah disimpan!');
                    await this.fetchData();
                } else {
                    alert('Error saving settings');
                }
            } catch (error) {
                console.error('Error saving settings:', error);
            }
        },

        logout() {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userRole');
            window.location.href = 'login.html';
        },

        animateNumber(element, endValue, duration = 1000) {
            const startValue = 0;
            const startTime = performance.now();
            const formatter = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' });

            function update(time) {
                const elapsed = time - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const currentValue = Math.floor(startValue + (endValue - startValue) * progress);
                element.textContent = formatter.format(currentValue);
                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }

            requestAnimationFrame(update);
        },

        // Initialize
        async init() {
            if (!localStorage.getItem('isLoggedIn')) {
                window.location.href = 'login.html';
                return;
            }
            this.isViewOnly = localStorage.getItem('userRole') === 'pengawas';
            await this.fetchData();
            if (!this.selectedMonth && this.showMonthDetail) {
                this.selectedMonth = this.months.find(m => m.id === this.settings.activeMonth) || this.months[0];
            }
            // Animate total overall
            if (this.activeTab === 'dashboard' && this.$refs.totalOverall) {
                const total = this.getTotalOverall();
                this.animateNumber(this.$refs.totalOverall, total, 1000);
            }
        }
    };
}