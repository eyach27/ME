import { Component, OnInit,Input, ViewChild, ElementRef, HostBinding, AfterViewInit } from '@angular/core';
import { ThemeService } from '../theme.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { DepartmentService } from '../department/DepartmentService';
import { UserServiceGestService } from '../GestionUser/user-service-gest.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { GestionDocService } from '../GestionDoc/gestion-doc.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { ChartComponent, ApexAxisChartSeries, ApexChart, ApexXAxis, ApexTitleSubtitle, ApexNonAxisChartSeries, ApexResponsive, ApexOptions, NgApexchartsModule} from "ng-apexcharts";
import { combineLatest, concat, forkJoin, zip } from 'rxjs';
import { flatMap, map, mergeMap, toArray } from 'rxjs/operators';
import { User } from '../GestionUser/user';
import { gestionPlanService } from '../GestionForm/gestion-plan.service';
import { gestionFormService } from '../GestionForm/gestion-form.service';
import ApexCharts from 'apexcharts';
import { FormationPlan } from '../GestionForm/FormationPlan';
import { environment } from 'src/environments/environment';
const API = `${environment.apiBaseUrl }`;
import * as moment from 'moment';
import 'moment/locale/fr';
export type DonutChartOptions = {
  colors: string[];
  chart: ApexChart;
  labels: string[];
  plotOptions: {
    pie: {
      donut: {
        labels: {
          show: boolean;
          total: {
            show: boolean;
            label: string;
            formatter: (w: any) => string;
          };
        };
      };
    };
  };
  responsive: {
    breakpoint: number;
    options: {
      chart: {
        width: number;
      };
      legend: {
        position: string;
      };
    };
  }[];
};

export type DonutChartOptions2 = {
  chart: {
    type: 'donut';
  };
  series: ApexNonAxisChartSeries;
  labels: string[];
  responsive: ApexResponsive[];
};
moment.locale('fr');
@Component({
  selector: 'app-stattics',
  templateUrl: './stattics.component.html',
  styleUrls: ['./stattics.component.scss']
})
export class StatticsComponent implements OnInit   {
  @ViewChild("inputElement",{static:true}) inputElement : ElementRef<HTMLInputElement>;
  @HostBinding('class') componentClass = 'light';

  public donutChartSeries: ApexNonAxisChartSeries;
  public donutChartOptions: DonutChartOptions;
  //public frLocale: ApexLocale = frLocale;
  public pieChartOptions: DonutChartOptions2;
  public barChartOptions: ApexOptions;
  public stackedColumnChartOptions: any = {};
  public options :any;
  isLoggedIn: boolean;
  formateursCount: number = 0;
  adminsCount: number = 0;
  usersCount: number = 0;
  users: any;
  filteredUsers: any;
  departments: any[]; 
  departmentDocumentCounts: { [key: string]: number } = {}; 
  public selectedYear: string;
  public years: string[];
  chart: ApexCharts;
  usersActivated: any;
  selectedUser: User; 
  usersForm: any[];
  chartpie:ApexCharts;
  pieChartOptions2: any = {
    series: [],
    chart: {
      type: 'pie',
      height: 400,
      toolbar: {
        show: true
      }
      
      
    },
    colors: [
      
      "#0ed8b8"
      ,
      "#21252991"],
    labels: ['Formations a dispenser', 'Formations suivies'],
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };
  chartOptionsTop5: ApexOptions = {
    chart: {
      type: 'bar',
      height: 400,
      toolbar: {
        show: true
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true
      }
    },
    dataLabels: {
      enabled: true
    },
    xaxis: {
 
      categories: [],

    },
    yaxis: {
      title: {
        text: 'Nombre de formations'
      }
    },
    colors: ['#008FFB'],
    series: [],
  };
  expiredFormations: FormationPlan[];
  selecteduser: any = null;
  chartSeries: {
    name: string;
    data: number[];
  }[] = [];
    constructor(private departementService:DepartmentService ,private gestionDocService: GestionDocService, private tokenStorageService : TokenStorageService,
    private userServiceGestService: UserServiceGestService , private gestionplanservice : gestionPlanService , private gestionformservice : gestionFormService,
    private themeService: ThemeService )
    { this.themeService.observeMode().subscribe(mode => {
   this.componentClass = mode;});
   this.selectedYear = '';
   this.years = [];
   
    }
  
  async ngOnInit():  Promise<void> {
  if (this.tokenStorageService.getToken()) {
    this.isLoggedIn = true;
 
  }
 
  await Promise.all([
    this.getUsers(),
    this.calculateDocumentCounts(),
    this.calculateUserCountsPerDepartment(),
    this.calculateTrainingPlansPerFormation(),
    this.calculatePlansPerYearandMonth(),
    this.getActivatedUsers(),
    this.getFormations(),
    this.calculateExpiredFormationsForActivatedUsers(),
    this.calculateParticipationCounts()
  ]);
}
 


getUsers() {
  this.userServiceGestService.getUserList().subscribe(users => {
    this.users = users;
    this.formateursCount = this.users.filter(user => user.roles.some(role => role.name === 'ROLE_FORMATEUR')).length;
    this.adminsCount = this.users.filter(user => user.roles.some(role => role.name === 'ROLE_ADMIN')).length;
    this.usersCount = this.users.filter(user => user.roles.some(role => role.name === 'ROLE_USER')).length;
    this.donutChartOptions = {
      chart: {
        type: 'donut' as 'donut',
        toolbar: {
          show: true
        }
      },
      colors: [
        "#C7C8CA",
        "#0ed8b8"
        ,
        "#21252991"],
      labels: ['Formateurs', 'Administrateurs', 'Utilisateurs'],
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total',
                formatter: () => {
                  const total = this.formateursCount + this.adminsCount + this.usersCount;
                  return total + ' Comptes';
                 
                },
              },
            },
          },
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
    this.donutChartSeries = [this.formateursCount, this.adminsCount, this.usersCount];

  });
}
//docbydeb using a pie 
/*calculateDocumentCounts(): void {
  this.departementService.getAllDepartments().subscribe((departments) => {
    this.departments = departments;
    
    const requests = departments.map((department) =>
      this.gestionDocService.getDocByDep(department.name)
    );

    forkJoin(requests).subscribe((responses:any[])  => {
      responses.forEach((documents, index) => {
        const department = departments[index];
        const documentCount = documents.length;
        this.departmentDocumentCounts[department.name] = documentCount;
      });
      this.pieChartOptions = {
        chart: {
          type: 'donut',
        },
        series: [],
        labels: [],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: 'bottom',
              },
            },
          },
        ],
      };
      this.pieChartOptions.series = Object.values(this.departmentDocumentCounts);
      this.pieChartOptions.labels = Object.keys(this.departmentDocumentCounts);
   
    });
  });

  }*/
 
  calculateDocumentCounts(): void {
    this.departementService.getAllDepartments().subscribe((departments) => {
      const requests = departments.map((department) =>
        this.gestionDocService.getDocByDep(department.name)
      );

      forkJoin(requests).subscribe((responses: any[]) => {
        const departmentDocumentCounts = {};

        responses.forEach((documents, index) => {
          const department = departments[index];
          const documentCount = documents.length;
          departmentDocumentCounts[department.name] = documentCount;
        });

        this.stackedColumnChartOptions = {
          chart: {
            type: 'bar',
            height: 350,
          },
          colors: [
        
            "#0ed8b8"
            ,
            "#21252991"],
            series: [
            {
              name: 'Nombre de documents :',
              data: Object.values(departmentDocumentCounts),
            },
          ],
          xaxis: {
            categories: Object.keys(departmentDocumentCounts),
          },
        };
      });
    });
  }

/*calculateUserCountsPerDepartment(): void {
  forkJoin([
    this.userServiceGestService.getUserList(),
    this.departementService.getAllDepartments()
  ]).subscribe(([users, departments]) => {
    const departmentUserCounts = {};

    // Initialize department counts to 0
    departments.forEach((department) => {
      departmentUserCounts[department.name] = 0;
    });

    // Count users in each department
    users.forEach((user) => {
      const userDepartmentId = user.poste;
      if (departmentUserCounts.hasOwnProperty(userDepartmentId)) {
        departmentUserCounts[userDepartmentId]++;
      }
    });

    console.log(departmentUserCounts);
  });
}*/

calculateUserCountsPerDepartment(): void {
  forkJoin([
    this.userServiceGestService.getUserList(),
    this.departementService.getAllDepartments()
  ]).subscribe(([users, departments]) => {
    const departmentUserCounts = {};

    // Initialize department counts to 0
    departments.forEach((department) => {
      departmentUserCounts[department.name] = 0;
    });

    // Count users in each department
    users.forEach((user) => {
      const userDepartmentId = user.poste;
      if (departmentUserCounts.hasOwnProperty(userDepartmentId)) {
        departmentUserCounts[userDepartmentId]++;
      }
    });

    // Generate bar chart options
    this.barChartOptions = {
      colors: [
        "#0ed8b8"
        ,
        "#21252991"],
      chart: {
        type: 'bar',
        height: 350,
      },
      series: [
        {
          name: 'Nombre de comptes :',
          data: Object.entries(departmentUserCounts).map(([department, count]) => ({
            x: department,
            y: count,
          })),
        },
      ],
      xaxis: {
        type: 'category',
      },
    };

    console.log(departmentUserCounts);
  });
}

/*calculateTrainingPlansPerFormation(): void {
  combineLatest([
    this.gestionformservice.getListForm(),
    this.gestionplanservice.getAll()
  ]).subscribe(([formations, trainingPlans]) => {
    const formationTrainingPlanCounts = {};

    // Initialize formation counts to 0
    formations.forEach((formation) => {
      formationTrainingPlanCounts[formation.name] = 0;
    });

    // Count training plans for each formation
    trainingPlans.forEach((trainingPlan) => {
      const formationId = trainingPlan.formation.name;
      if (formationTrainingPlanCounts.hasOwnProperty(formationId)) {
        formationTrainingPlanCounts[formationId]++;
      }
    });

    console.log(formationTrainingPlanCounts);
  });
}*/
calculateTrainingPlansPerFormation(): void {
  combineLatest([
    this.gestionformservice.getListForm(),
    this.gestionplanservice.getAll()
  ]).subscribe(([formations, trainingPlans]) => {
    const formationTrainingPlanCounts = {};

    // Initialize formation counts to 0
    formations.forEach((formation) => {
      formationTrainingPlanCounts[formation.name] = 0;
    });

    // Count training plans for each formation
    trainingPlans.forEach((trainingPlan) => {
      const formationId = trainingPlan.formation.name;
      if (formationTrainingPlanCounts.hasOwnProperty(formationId)) {
        formationTrainingPlanCounts[formationId]++;
      }
    });

    // Prepare chart data
    const formationNames = Object.keys(formationTrainingPlanCounts);
    const trainingPlanCounts = Object.values(formationTrainingPlanCounts);

    // Create a new ApexCharts instance
    this.options = {
      chart: {
        type: 'bar',
        stacked: true,
        toolbar: {
          show: true
        }
      },
      colors: [
        
        "#0ed8b8"
        ,
        "#21252991"],
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      dataLabels: {
        enabled: true
      },
      series: [
        {
          name: 'Nombre de planifications',
          data: trainingPlanCounts
        }
      ],
      xaxis: {
        categories: formationNames
      }
      
    };

    new ApexCharts(document.getElementById('horizontal-bar-chart-container'), this.options).render();
  });
}
/*calculatePlansPerMonthandYear(): void {
  let trainingPlans: FormationPlan[] = []; // Define the trainingPlans array

  // Fetch the training plans data from your service or source and assign it to trainingPlans
  this.gestionplanservice.getAll().subscribe((plans: FormationPlan[]) => {
    trainingPlans = plans;

    const plansPerMonth: { [month: string]: number } = {};
    const plansPerYear: { [year: string]: number } = {};

    trainingPlans.forEach((plan) => {
      const startDate = new Date(plan.startDate);
      const month = startDate.getMonth() + 1;
      const year = startDate.getFullYear();

      // Count plans per month
      if (plansPerMonth.hasOwnProperty(month.toString())) {
        plansPerMonth[month]++;
      } else {
        plansPerMonth[month] = 1;
      }

      // Count plans per year
      if (plansPerYear.hasOwnProperty(year.toString())) {
        plansPerYear[year]++;
      } else {
        plansPerYear[year] = 1;
      }
    });

    console.log('Plans per month:', plansPerMonth);
    console.log('Plans per year:', plansPerYear);
  });
}*/
/*calculatePlansPerYearandMonth(): void {
  let trainingPlans: FormationPlan[] = []; // Define the trainingPlans array

  // Fetch the training plans data from your service or source and assign it to trainingPlans
  this.gestionplanservice.getAll().subscribe((plans: FormationPlan[]) => {
    trainingPlans = plans;

    const plansPerYear: { [year: string]: { [month: string]: number } } = {};

    trainingPlans.forEach((plan) => {
      const startDate = new Date(plan.startDate);
      const month = startDate.getMonth() + 1;
      const year = startDate.getFullYear();

      if (!plansPerYear.hasOwnProperty(year.toString())) {
        plansPerYear[year] = {};
      }

      if (plansPerYear[year].hasOwnProperty(month.toString())) {
        plansPerYear[year][month]++;
      } else {
        plansPerYear[year][month] = 1;
      }
    });

    console.log('Plans per year:', plansPerYear);
  });
}*/
//i like this one but i wanted more developped
/*calculatePlansPerYearandMonth(): void {
  let trainingPlans: FormationPlan[] = [];

  this.gestionplanservice.getAll().subscribe((plans: FormationPlan[]) => {
    trainingPlans = plans;

    const plansPerMonth: { [month: string]: number } = {};
    const months: number[] = [];

    trainingPlans.forEach((plan) => {
      const month = new Date(plan.startDate).getMonth() + 1;

      if (plansPerMonth.hasOwnProperty(month.toString())) {
        plansPerMonth[month]++;
      } else {
        plansPerMonth[month] = 1;
      }
    });

    for (let i = 1; i <= 12; i++) {
      months.push(i);
    }

    const planCounts = months.map((month) => plansPerMonth[month.toString()] || 0);
    const monthLabels = months.map((month) => this.getMonthName(month) + ' (' + planCounts[month - 1] + ')');

    const options: ApexOptions = {
      chart: {
        type: 'line',
      },
      series: [
        {
          name: 'Number of Plans',
          data: planCounts,
        },
      ],
      xaxis: {
        categories: monthLabels,
      },
    };

    new ApexCharts(document.getElementById('line-chart-container'), options).render();
  });
}

getMonthName(month: number): string {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return monthNames[month - 1];
}*/

calculatePlansPerYearandMonth(): void {
  let trainingPlans: FormationPlan[] = [];

  this.gestionplanservice.getAll().subscribe((plans: FormationPlan[]) => {
    trainingPlans = plans;

    const plansPerYear: { [year: string]: { [month: string]: number } } = {};
    const months: number[] = [];

    trainingPlans.forEach((plan) => {
      const year = new Date(plan.startDate).getFullYear().toString();
      const month = new Date(plan.startDate).getMonth() + 1;

      if (!plansPerYear.hasOwnProperty(year)) {
        plansPerYear[year] = {};
      }

      if (plansPerYear[year].hasOwnProperty(month.toString())) {
        plansPerYear[year][month]++;
      } else {
        plansPerYear[year][month] = 1;
      }
    });

    this.years = Object.keys(plansPerYear).sort((a, b) => +a - +b);

    if (!this.selectedYear || !plansPerYear.hasOwnProperty(this.selectedYear)) {
      this.selectedYear = this.years[0];
    }

    for (let i = 1; i <= 12; i++) {
      months.push(i);
    }

    const planCounts = months.map((month) => plansPerYear[this.selectedYear][month.toString()] || 0);
    //const monthLabels = months.map((month) => this.getMonthName(month) + ' (' + planCounts[month - 1] + ')');
    const monthLabels = moment.months();
    const options: ApexOptions = {
      chart: {
        type: 'line',
      },
      colors: [
        "#0ed8b8"
        ,
        "#21252991"],
      series: [
        {
          name: 'Nombre de planifications',
          data: planCounts,
        },
      ],
      xaxis: {
        categories: monthLabels.map((month) => moment(month, 'MMMM').format('MMMM')),

        //categories: monthLabels,
      },
    };

    if (!this.chart) {
      this.chart = new ApexCharts(document.getElementById('line-chart-container'), options);
      this.chart.render();
    } else {
      this.chart.updateOptions(options);
    }
  });
}
getMonthName(month: number): string {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return monthNames[month - 1];
}
changeYear(year: string): void {
  this.selectedYear = year;
  this.calculatePlansPerYearandMonth();
}

/*getActivatedUsers() {
  this.userServiceGestService.getUserList().pipe(
    map(usersActivated => usersActivated.filter(user => user.statut == 1))
  ).subscribe(
    filteredUsers => {
      this.usersActivated = filteredUsers;
     console.log('awama tahti')
      console.log(this.usersActivated);

    },
    error => {
      console.log('An error occurred while fetching activated users:', error);
    }
  );
}*/



getActivatedUsers() {
  return this.userServiceGestService.getUserList().pipe(
    map(usersActivated => usersActivated.filter(user => user.statut == 1))
  );
}


/*getFormations() {
  this.getActivatedUsers().subscribe(
    usersForm => {
      console.log('Activated users:', usersForm);

      const userWithFormationSuivies$ = usersForm.map(user => {
        return this.gestionplanservice.getPlanningListS(user.id).pipe(
          map(formationSuivies => ({ user, nbrFormationSuivies: formationSuivies.length }))
        );
      });

      const userWithFormationADispense$ = usersForm.map(user => {
        return this.gestionplanservice.getPlanningListD(user.id).pipe(
          map(formationADispense => ({ user, nbrFormationADispense: formationADispense.length }))
        );
      });

      forkJoin([...userWithFormationSuivies$, ...userWithFormationADispense$]).subscribe(
        usersWithFormation => {
          console.log('Users with formations:', usersWithFormation);

          // Continue with any further operations on users with formations
          // ...
        },
        error => {
          console.log('An error occurred while fetching formations:', error);
        }
      );
    },
    error => {
      console.log('An error occurred while fetching activated users:', error);
    }
  );
}*/
/*getFormations() {
  this.getActivatedUsers().subscribe(
    usersForm => {
      this.usersForm = usersForm;
      console.log('Activated users:', this.usersForm);

      // Render the initial chart with default data
    },
    error => {
      console.log('An error occurred while fetching activated users:', error);
    }
  );
}*/
getFormations() {
  this.getActivatedUsers().subscribe(
    usersForm => {
      this.usersForm = usersForm.map(user => {
        const userWithPhoto = { ...user }; // Create a copy of the user object
        userWithPhoto.p = '../../assets/images/photoParDefaut.jpg'; // Default photo

        if (user.photo) {
          const fileName = user.photo.substring(user.photo.lastIndexOf('/') + 1);
          userWithPhoto.p = API + 'api/gestion/PDP/' + fileName;
        }

        return userWithPhoto;
      });

      console.log('Activated users:', this.usersForm);

      // Render the initial chart with default data
    },
    error => {
      console.log('An error occurred while fetching activated users:', error);
    }
  );
}

onUserChange() {
  if (this.selectedUser) {
    const selectedUser = this.usersForm.find(user => user.username === this.selectedUser);

    const userWithFormationSuivies$ = this.gestionplanservice.getPlanningListS(selectedUser.id).pipe(
      map(formationSuivies => ({ user: selectedUser, nbrFormationSuivies: formationSuivies.length }))
    );

    const userWithFormationADispense$ = this.gestionplanservice.getPlanningListD(selectedUser.id).pipe(
      map(formationADispense => ({ user: selectedUser, nbrFormationADispense: formationADispense.length }))
    );

    forkJoin([userWithFormationSuivies$, userWithFormationADispense$]).subscribe(
      usersWithFormation => {
        // Get the number of dispensed and followed formations
        const nbrFormDispense = usersWithFormation[1].nbrFormationADispense || 0;
        const nbrFormSuivie = usersWithFormation[0].nbrFormationSuivies || 0;

        // Update the chart data
        this.pieChartOptions2.series = [nbrFormDispense, nbrFormSuivie];
      },
      error => {
        console.log('An error occurred while fetching formations:', error);
      }
    );
  }
}

/*calculateExpiredFormationsForActivatedUsers(): void {
  const currentDate = new Date();

  this.getActivatedUsers().subscribe(
    activatedUsers => {
      activatedUsers.forEach(user => {
        this.gestionplanservice.getAll().subscribe(
          formations => {
            const expiredFormations = formations.filter(formation => {
              // Check if the formation's formateur property is not null and matches the user's ID
              // Also, compare the end date of the formation with the current date
              return formation.formateur && formation.formateur.id === user.id && new Date(formation.endDate) < currentDate;
            });

            const count = expiredFormations.length;
            console.log(`Number of expired formations for user (ID: ${user.username}): ${count}`);
          },
          error => {
            console.log(`An error occurred while fetching all formations for user (ID: ${user.id}):`, error);
          }
        );
      });
    },
    error => {
      console.log('An error occurred while fetching activated users:', error);
    }
  );
}*/
/*calculateExpiredFormationsForActivatedUsers(): void {
  const currentDate = new Date();
  const formateurCounts = [];

  this.getActivatedUsers().subscribe(
    activatedUsers => {
      activatedUsers.forEach(user => {
        this.gestionplanservice.getAll().subscribe(
          formations => {
            const expiredFormations = formations.filter(formation => {
              // Check if the formation's formateur property is not null and matches the user's ID
              // Also, compare the end date of the formation with the current date
              return formation.formateur && formation.formateur.id === user.id && new Date(formation.endDate) < currentDate;
            });

            const count = expiredFormations.length;
            formateurCounts.push({ formateur: user, count: count });

            if (formateurCounts.length === activatedUsers.length) {
              // Sort the formateurCounts array based on the count in descending order
              formateurCounts.sort((a, b) => b.count - a.count);

              // Get the top 5 formateurs
              const topFormateurs = formateurCounts.slice(0, 5);
              console.log('Top 5 Formateurs:', topFormateurs);
            }
          },
          error => {
            console.log(`An error occurred while fetching all formations for user (ID: ${user.id}):`, error);
          }
        );
      });
    },
    error => {
      console.log('An error occurred while fetching activated users:', error);
    }
  );
}*/
/*calculateExpiredFormationsForActivatedUsers(): void {
  const currentDate = new Date();
  const formateurCounts = [];

  this.getActivatedUsers().subscribe(
    activatedUsers => {
      activatedUsers.forEach(user => {
        this.gestionplanservice.getAll().subscribe(
          formations => {
            const expiredFormations = formations.filter(formation => {
              // Check if the formation's formateur property is not null and matches the user's ID
              // Also, compare the end date of the formation with the current date
              return formation.formateur && formation.formateur.id === user.id && new Date(formation.endDate) < currentDate;
            });

            const count = expiredFormations.length;
            formateurCounts.push({ formateur: user, count: count });

            if (formateurCounts.length === activatedUsers.length) {
              // Sort the formateurCounts array based on the count in descending order
              formateurCounts.sort((a, b) => b.count - a.count);

              // Get the top 5 formateurs
              const topFormateurs = formateurCounts.slice(0, 5);
              console.log('Top 5 Formateurs:', topFormateurs);

              // Update the chart options and series
              this.chartOptionsTop5.xaxis.categories = topFormateurs.map(formateur => formateur.formateur.username);
              console.log( this.chartOptionsTop5.xaxis.categories)
                this.chartSeries = [{
                name: 'Nombre de formations',
                data: topFormateurs.map(formateur => formateur.count)
              }];
            }
          },
          error => {
            console.log(`An error occurred while fetching all formations for user (ID: ${user.id}):`, error);
          }
        );
      });
    },
    error => {
      console.log('An error occurred while fetching activated users:', error);
    }
  );
}*/


//tehseb mrigl
/*calculateParticipationCounts(): void {
  const currentDate = new Date();
  const participationCounts = {};

  this.gestionplanservice.getAll().subscribe(formations => {
    const expiredFormations = formations.filter(formation => new Date(formation.endDate) < currentDate);

    expiredFormations.forEach(formation => {
      formation.participants.forEach(participant => {
        if (participant.statut === true) {
          if (participationCounts.hasOwnProperty(participant.username)) {
            participationCounts[participant.username]++;
          } else {
            participationCounts[participant.username] = 1;
          }
        }
      });
    });

    console.log('Participation counts:', participationCounts);
  });
}*/
calculateExpiredFormationsForActivatedUsers(): void {
  const currentDate = new Date();
  const formateurCounts = [];

  this.getActivatedUsers().subscribe(
    activatedUsers => {
      const userCountPromises = activatedUsers.map(user => {
        return this.gestionplanservice.getAll().pipe(
          map(formations => {
            this.expiredFormations = formations.filter(formation => {
              return formation.formateur && formation.formateur.id === user.id && new Date(formation.endDate) < currentDate;
            });

            const count = this.expiredFormations.length;
            return { username: user.username, count: count };
          })
        );
      });
      forkJoin(userCountPromises).subscribe(
        (formateurCounts: { username: string, count: number }[]) => {
          // Sort the formateurCounts array based on the count in descending order
          formateurCounts.sort((a, b) => b.count - a.count);

          // Get the top 5 formateurs
          const topFormateurs = formateurCounts.slice(0, 5);
          console.log('Top 5 Formateurs:', topFormateurs);

    // Prepare chart options
    const chartOptions = {
      chart: {
        type: 'bar',
        height: 350
        
      },  colors: [
        "#0ed8b8"
        ,
        "#21252991"]
      ,
      toolbar: {
        show: true
      },

      series: [{
        name: 'Nombre de Formations',
        data: topFormateurs.map(item => item.count)
      }],
      xaxis: {
        categories: topFormateurs.map(item => item.username)
      }
    };

    // Render the chart
    const chart = new ApexCharts(document.getElementById('FormateurTop5'), chartOptions);
    chart.render();
  })})
}

calculateParticipationCounts(): void {
  const currentDate = new Date();
  const participationCounts = {};

  this.gestionplanservice.getAll().subscribe(formations => {
    const expiredFormations = formations.filter(formation => new Date(formation.endDate) < currentDate);

    expiredFormations.forEach(formation => {
      formation.participants.forEach(participant => {
        if (participant.statut === true) {
          if (participationCounts.hasOwnProperty(participant.username)) {
            participationCounts[participant.username]++;
          } else {
            participationCounts[participant.username] = 1;
          }
        }
      });
    });

    // Prepare chart data
    const chartData = Object.entries(participationCounts).map(([username, count]) => ({
      username,
      count
    }));

    // Sort chart data in descending order based on count
    chartData.sort((a: { username: string, count: number }, b: { username: string, count: number }) => b.count - a.count);

    // Get top 5 participation counts
    const topCounts = chartData.slice(0, 5);

    // Prepare chart options
    const chartOptions = {
      chart: {
        type: 'bar',
        height: 350
        
      },
      colors: [
        "#0ed8b8"
        ,
        "#21252991"]
      ,
      toolbar: {
        show: true
      },
      series: [{
        name: 'Nombre de participations',
        data: topCounts.map(item => item.count)
      }],
      xaxis: {
        categories: topCounts.map(item => item.username)
      }
    };

    // Render the chart
    const chart = new ApexCharts(document.getElementById('ParticipantsTop5'), chartOptions);
    chart.render();
  });
}

}