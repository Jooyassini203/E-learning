$(function () {
  loadData();
  loadYear();

  /*define table pagination*/
  // $('#table_cours').paging({limit:5});

  $("#search-cours-field").on("keyup", function () {
    if ($(this).val()) {
      value = $(this).val().toLowerCase();
      $("#table_cours tr").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
      });
    }
  });
  /*End table pagination*/

  $("#annee-univ").on("change", function (e) {
    loadData();
  });

  function loadYear() {
    $("#annee-univ").html("");
    for (let index = new Date().getFullYear(); index >= 2018; index--) {
      if (index == new Date().getFullYear()) {
        $("#annee-univ").append(
          $("<option>", { value: index, text: index, selected: true })
        );
      } else {
        $("#annee-univ").append(
          $("<option>", { value: index, text: index, selected: false })
        );
      }
    }
  }

  function loadData() {
    var code_prof = "code";
    code_prof = "PRO010";

    console.log("code_prof ", code_prof);
    var query =
      "SELECT a.*, b.libelle_ec, c.libelle_parc FROM `ueecparc` a LEFT JOIN ec b ON a.code_ue = b.code_ue and a.code_ec = b.code_ec LEFT JOIN parcours c ON a.code_parc = c.code_parc WHERE code_prof = '" +
      code_prof +
      "' and annee = '" +
      $("#annee-univ").val() +
      "' ORDER BY b.libelle_ec";

    $("#table_cours tbody").html("");
    $.ajax({
      url: "/selectData",
      method: "POST",
      dataType: "JSON",
      data: { query: query },
      success: (data) => {
        const protocol = window.location.protocol;
        const domain = window.location.hostname;
        const port = window.location.port;

        const full = `${protocol}://${domain}:${port ? port : ""}`;
        if (data) {
          $("#countCourse").html(data.length);
          var html = "";
          data.forEach((element) => {
            html +=
              `
                        <tr>
                            <td>
                                <div class="d-flex align-items-center">
                                    <!-- Image -->
                                    <div class="w-60px">
                                        <img src="/images/courses/4by3/08.jpg" class="rounded" alt="">
                                    </div>
                                    <div class="mb-0 ms-2">
                                        <!-- Title -->
                                        <h6><a href="mescours-details/${element.num}" data-id="` +
              element.num +
              `">` +
              element.libelle_ec +
              `</a></h6>
                                        <!-- Info -->
                                        <div class="d-sm-flex">
                                            <p class="h6 fw-light mb-0 small me-3 text-purple" style="font-size:9px;"><i class="fas fa-table text-orange me-2"></i>` +
              element.libelle_parc +
              `</p>
                                            <p class="h6 fw-light mb-0 small text-purple" style="font-size:9px;"><i class="fas fa-check-circle text-success me-2"></i>6 Completed</p>
                                        </div>
                                    </div>
                                </div>
                                 
                            </td> 
                            <td>` +
              element.credit +
              `</td>
                            <td>` +
              element.nbr_heure +
              `H</td> 
                            <td>S` +
              element.code_periode +
              `</td>
                            <td>
                            <a href="#" class="btn btn-sm btn-success-soft btn-round me-1 mb-0 btn-edit" data-id="` +
              element.num +
              `"><i class="far fa-fw fa-edit"></i></a>
                            
                            </td>
                        </tr>
                        `;
          });
          $("#table_cours tbody").html(html);

          //$('#table_cours').paging({limit:5});

          $("#nav-pagination").html("");
          var rowsShown = 5;
          var rowsTotal = $("#table_cours tbody tr").length;
          var numPages = rowsTotal / rowsShown;
          $("#number-rows").html(
            "Showing 1 to " + rowsShown + " of " + rowsTotal + " entries"
          );
          for (i = 0; i < numPages; i++) {
            var pageNum = i + 1;
            if (pageNum == 1) {
              $("#nav-pagination").append(
                '<li class="page-item mb-0"><a class="page-link" href="JavaScript:void(0)" rel=' +
                  pageNum +
                  ' tabindex="-1">' +
                  pageNum +
                  "</a></li>"
              );
            } else {
              $("#nav-pagination").append(
                '<li class="page-item mb-0"><a class="page-link" href="JavaScript:void(0)" rel=' +
                  pageNum +
                  ">" +
                  pageNum +
                  "</a></li>"
              );
            }
          }
          $("#table_cours tbody tr").hide();
          $("#table_cours tbody tr").slice(0, rowsShown).show();
          $("#nav-pagination li:first").addClass("active");

          $("#nav-pagination a").bind("click", function () {
            console.log("yes");
            $("#nav-pagination li").removeClass("active");
            $(this).closest("li").addClass("active");
            var currPage = $(this).attr("rel");
            var startItem = currPage * rowsShown;
            var endItem = startItem + rowsShown;

            $("#number-rows").html(
              "Showing " +
                startItem +
                " to " +
                endItem +
                " of " +
                rowsTotal +
                " entries"
            );

            $("#table_cours tbody tr")
              .css("opacity", "0.0")
              .hide()
              .slice(startItem, endItem)
              .css("display", "table-row")
              .animate({ opacity: 1 }, 300);
          });
        }
      },
    });
  }

  function loadParcours() {
    var query = `SELECT `;

    $.ajax({
      url: "/selectData",
      method: "POST",
      dataType: "JSON",
      data: { query: query },
      success: (data) => {},
    });
  }

  $(".btn-edit").on("click", function (e) {});
});
